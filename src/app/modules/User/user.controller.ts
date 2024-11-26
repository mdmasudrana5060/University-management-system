/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

import catchAsync from '../../utils/catchAsync';
import AppError from '../../error/AppError';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  // const { error, value } = studentValidationSchema.validate(student);

  // const zodParsedData = studentValidationSchema.parse(student);
  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    student,
  );
  // if (error) {
  //   res.status(500).json({
  //     success: false,
  //     message: 'Something went wrong',
  //     error: error.details,
  //   });
  // }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student created successfully',
    data: result,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved  succesfully',
    data: result,
  });
});
const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Status changed  succesfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
