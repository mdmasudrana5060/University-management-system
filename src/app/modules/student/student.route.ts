import express from 'express';
import { studentController } from './student.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.getAllStudents,
);
router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.getStudent,
);
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.updateStudent,
);
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.deleteStudent,
);

export const StudentRoutes = router;
