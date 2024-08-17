import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';

const loginUserIntoDb = async (payload: TLoginUser) => {
  //   const isUserExist = await User.findOne({ id: payload?.id });
  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched');
  }
  // create token and send to the client.
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData?.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched');
  }
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHasedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized');
  }
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  const userStatus = user.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedPasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );
  return {
    accessToken,
  };
};
export const AuthServices = {
  loginUserIntoDb,
  changePassword,
  refreshToken,
};
