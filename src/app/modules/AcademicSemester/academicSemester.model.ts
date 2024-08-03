import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: true,
    enum: AcademicSemesterName,
  },
  code: {
    type: String,
    required: true,
    enum: AcademicSemesterCode,
  },
  year: {
    type: String,
    required: true,
  },
  startMonth: {
    type: String,
    required: true,
    enum: months,
  },
  endMonth: {
    type: String,
    required: true,
    enum: months,
  },
});
academicSemesterSchema.pre('save', async function (next) {
  const isAcademicSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isAcademicSemesterExist) {
    throw new Error('Semester Already exist');
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'academicSemester',
  academicSemesterSchema,
);
