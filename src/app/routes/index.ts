import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/User/user.route';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/academicDepartment.route';

const router = Router();

// router.use('/students', StudentRoutes);
// router.use('/users', UserRoutes);
// router.use('/academic-semesters')
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
