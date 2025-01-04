import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { EnrolledCourseValidation } from './enrolledCourse.Validation';
const router = express.Router();
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidation.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseController.createEnrollCourse,
);

router.get(
  '/',
  auth(USER_ROLE.faculty),
  EnrolledCourseController.getAllEnrolledCourses,
);

router.get(
  '/my-enrolled-courses',
  auth(USER_ROLE.student),
  EnrolledCourseController.getMyEnrolledCourses,
);
router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    EnrolledCourseValidation.updateEnrolledCourseMarksValidationSchema,
  ),
  EnrolledCourseController.updateEnrolledCourseMarks,
);
export const EnrolledCourseRoutes = router;
