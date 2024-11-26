import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validation';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
router.post(
  '/create-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);

router.get('/:id', CourseController.getSingleCourse);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidation.courseWithFacultiesValidationSchema),
  CourseController.assignFacultiesWithCourse,
);
router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),

  CourseController.getFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidation.courseWithFacultiesValidationSchema),
  CourseController.removeFacultiesWithCourse,
);
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CourseController.deleteCourse,
);
router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseController.getAllCourses,
);

export const CourseRoutes = router;
