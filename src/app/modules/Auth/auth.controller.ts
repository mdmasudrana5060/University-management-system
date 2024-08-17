import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDb(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshtoken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access Token is retrieved successfully',
    data: result,
  });
});

export const authController = {
  loginUser,
  changePassword,
  refreshToken,
};
