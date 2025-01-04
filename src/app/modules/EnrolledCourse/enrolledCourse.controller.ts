import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrollCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await EnrolledCourseServices.createEnrollCourseIntoDB(
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is enrolled successfully',
    data: result,
  });
});

const getAllEnrolledCourses = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;

  const result = await EnrolledCourseServices.getAllEnrolledCoursesFromDB(
    facultyId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId;
  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your enrolled Courses retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  console.log(req.user.userId, req.body);
  const faculty = req.user.userId;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    faculty,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Marks updated successfully',
    data: result,
  });
});
export const EnrolledCourseController = {
  createEnrollCourse,
  getAllEnrolledCourses,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
