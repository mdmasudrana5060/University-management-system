import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from './student.zod.validation';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await studentServices.getStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'students retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const getStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.getStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student retrieved successfully',
    data: result,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student updated successfully',
    data: result,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student deleted successfully',
    data: result,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
export const studentController = {
  getAllStudents,
  getStudent,
  deleteStudent,
  updateStudent,
};
