import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { userStatus } from './user.constant';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: userStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// document middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = ' ';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id) {
  return await User.findOne({ id }).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
userSchema.statics.isJWTIssuedPasswordChanged = async function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangeTime =
    new Date(passwordChangedTimeStamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuedTimeStamp;
};
export const User = model<TUser, UserModel>('user', userSchema);
