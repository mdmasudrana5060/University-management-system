/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

// we are declaring static method
// to write static method interface should change from type to interface
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedPasswordChanged(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
