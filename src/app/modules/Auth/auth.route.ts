import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.loginUser,
);
router.post(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  validateRequest(authValidation.passwordValidationSchema),
  authController.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
);
router.post(
  '/forget-password',
  validateRequest(authValidation.forgetPasswordValidationSchema),
  authController.forgetPassword,
);
router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordValidationSchema),
  authController.resetPassword,
);

export const AuthRoutes = router;
