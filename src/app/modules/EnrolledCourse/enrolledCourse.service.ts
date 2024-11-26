/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEnrolledCourse } from './enrolledCourse.interface';
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrollCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'offered course is not found');
  }

  const course = await Course.findById(isOfferedCourseExists.course);
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full');
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not found');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled');
  }

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
    { maxCredit: 1 },
  );

  // total enrolled credit + new enrolld course credit >maxCredit theke beshi hoye gele throw error korte hoibo
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCoursedData',
      },
    },
    {
      $unwind: '$enrolledCoursseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  if (
    totalCredits &&
    semesterRegistration?.maxCredit &&
    totalCredits + course?.credits > semesterRegistration?.maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have excedded maximum number of credits',
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll course');
    }
    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not found',
    );
  }
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'offered course is not found');
  }
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not found');
  }
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not found');
  }
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
  }

  //dynamic updata
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };
  // if final term  mark asle kichu data update korte hoibe like grade gradepoint isCompleted
  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isCourseBelongToFaculty.courseMarks;
    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);
    const result = calculateGradeAndPoints(totalMarks);
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );
  return result;
};
const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student Faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const EnrolledCourseServices = {
  createEnrollCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getMyEnrolledCoursesFromDB,
};
