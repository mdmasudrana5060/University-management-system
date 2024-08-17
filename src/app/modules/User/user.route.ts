import express from 'express';
import { UserController } from './user.controller';

import validateRequest from '../../middlewares/validateRequest';
import { createStudentValidationSchema } from '../student/student.zod.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  UserController.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);

export const UserRoutes = router;
