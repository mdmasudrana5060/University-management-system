import { z } from 'zod';

// UserName Schema
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: '{VALUE} is not capitalize format',
      },
    ),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
});

// Guardian Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father name is required'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherContactNo: z.string().min(1, 'Father contact no is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  motherOccupation: z.string().min(1, 'Mother occupation is required'),
  motherContactNo: z.string().min(1, 'Mother contact no is required'),
});

// LocalGuardian Schema
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian name is required'),
  occupation: z.string().min(1, 'Local Guardian occupation is required'),
  contactNo: z.string().min(1, 'Local Guardian contact number is required'),
  address: z.string().min(1, 'Local Guardian address is required'),
});

// Student Schema
export const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'password is required'),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female'], {
        errorMap: () => ({
          message: "The gender must be one of the following: 'male', 'female'",
        }),
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email('Invalid email format')
        .min(1, 'Email must be given'),
      contactNo: z.string().min(1, 'Contact number must be given'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number must be given'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present address must be given'),
      permanentAddress: z.string().min(1, 'Permanent address must be given'),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImg: z.string().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

const updatedUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: '{VALUE} is not capitalize format',
      },
    ),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

// Guardian Schema
const updatedGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

// LocalGuardian Schema
const updatedLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

// Student Schema
export const UpdateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: updatedUserNameValidationSchema.optional(),
          gender: z
            .enum(['male', 'female'], {
              errorMap: () => ({
                message:
                  "The gender must be one of the following: 'male', 'female'",
              }),
            })
            .optional(),
          dateOfBirth: z.string().optional(),
          email: z.string().email('Invalid email format').optional(),
          contactNo: z.string().optional(),
          emergencyContactNo: z.string().optional(),
          bloodGroup: z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
            .optional(),
          presentAddress: z.string().optional(),
          permanentAddress: z.string().optional(),
          guardian: updatedGuardianValidationSchema.optional(),
          localGuardian: updatedLocalGuardianValidationSchema.optional(),
          profileImg: z.string().optional(),
          admissionSemester: z.string().optional(),
          academicDepartment: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const studentValidations = {
  createStudentValidationSchema,
};
