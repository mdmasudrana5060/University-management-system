/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  // const { error, value } = studentValidationSchema.validate(student);

  // const zodParsedData = studentValidationSchema.parse(student);
  const result = await UserServices.createStudentIntoDB(password, student);
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

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
};
