import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validation';
import { CourseController } from './course.controller';

const router = express.Router();
router.post(
  '/create-course',
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);

router.get('/:id', CourseController.getSingleCourse);

router.patch(
  '/:id',
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidation.courseWithFacultiesValidationSchema),
  CourseController.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidation.courseWithFacultiesValidationSchema),
  CourseController.removeFacultiesWithCourse,
);
router.delete('/:id', CourseController.deleteCourse);
router.get('/', CourseController.getAllCourses);

export const CourseRoutes = router;
