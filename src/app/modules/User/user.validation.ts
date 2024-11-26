import { z } from 'zod';
import { userStatus } from './user.constant';
const userValidationSchema = z.object({
  id: z.string(),
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...userStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
