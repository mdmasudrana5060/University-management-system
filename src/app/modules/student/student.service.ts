import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../User/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getStudentsFromDB = async (query: Record<string, unknown>) => {
  // let searchTerm = '';
  // const queryObj = { ...query };
  // if (query?.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  //   console.log(searchTerm);
  // }

  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // const studentSearchableFields = [
  //   'email',
  //   'name.middleName',
  //   'presentAddress',
  // ];
  // const searchQuery = StudentModel.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // const filterQuery = searchQuery
  //   .find(queryObj)
  // .populate('admissionSemester')
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // });
  // let sort = '-createdAt';
  // if (query?.sort) {
  //   sort = query.sort as string;
  // }

  // let page = 1;
  // let limit = 1;
  // let skip = 0;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const sortQuery = filterQuery.sort(sort);
  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // let fields = '-_v';

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  //   console.log(fields);
  // }
  // const fieldQuery = await limitQuery.select(fields);
  // return fieldQuery;

  const StudentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await StudentQuery.modelQuery;
  return result;
};

const getStudentFromDB = async (id: string) => {
  const result = await StudentModel.findById(id);
  // const result = await StudentModel.aggregate([{ $match: { id: id } }]);
  return result;
};
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;
  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await StudentModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};
export const studentServices = {
  getStudentsFromDB,
  getStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
