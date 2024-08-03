import express from 'express';
import { UserController } from './user.controller';

import validateRequet from '../../middlewares/validateRequest';
import { createStudentValidationSchema } from '../student/student.zod.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequet(createStudentValidationSchema),
  UserController.createStudent,
);

export const UserRoutes = router;
