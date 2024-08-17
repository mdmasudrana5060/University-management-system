import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  prefix: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: Number,
    required: true,
    trim: true,
  },
  preRequisiteCourses: [preRequisiteCourseSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'faculty',
    },
  ],
});

export const Course = model<TCourse>('course', courseSchema);
export const CourseFaculty = model<TCourseFaculty>(
  'courseFaculty',
  courseFacultySchema,
);
