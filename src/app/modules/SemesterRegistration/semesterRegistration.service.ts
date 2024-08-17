import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester not Found',
    );
  }
  const isSemesterRegistationExist = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered',
    );
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDb = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};
const getSingleSemesterRegistrationFromDb = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};
const updateSemesterRegistrationIntoDb = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistationExist = await SemesterRegistration.findById(id);
  if (!isSemesterRegistationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found');
  }
  const requestedStatus = payload?.status;
  // if the requester semester is ended we will not update anything
  const currentSemesterStatus = isSemesterRegistationExist.status;
  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }
  if (currentSemesterStatus === 'UPCOMING' && requestedStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  if (currentSemesterStatus === 'ONGOING' && requestedStatus === 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id);
  return result;
};
export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationsFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSemesterRegistrationIntoDb,
};
