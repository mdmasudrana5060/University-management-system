import mongoose, { Schema } from 'mongoose';
import { Days } from './OfferedCourse.constant';
import { TOfferedCourse } from './OfferedCourse.interface';

const offeredCourseSchema = new mongoose.Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'semesterRegistration',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'academicSemester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'academicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'academicDepartment',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'course',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Faculty',
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    days: [
      {
        type: String,
        enum: Days,
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourse = mongoose.model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);
