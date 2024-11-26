import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department must be a string',
      required_error: 'Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty must be a string',
      required_error: 'Faculty is required',
    }),
  }),
});
const updateAcademicDepartmentSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be a string',
        required_error: 'Name is required',
      })
      .optional(),
    f: z
      .string({
        invalid_type_error: 'Academic Faculty must be a string',
        required_error: 'Facult is required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentSchema,
};
