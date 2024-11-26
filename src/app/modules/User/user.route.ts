import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createStudentValidationSchema } from '../student/student.zod.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);
router.get(
  '/me',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),

  UserController.createAdmin,
);
router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

export const UserRoutes = router;
