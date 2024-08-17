import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/User/user.route';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/Faculty/faculty.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { CourseRoutes } from '../modules/Course/course.route';
import { SemesterRegistrationRoutes } from '../modules/SemesterRegistration/semesterRegistration.route';

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
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
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
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registration',
    route: SemesterRegistrationRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
