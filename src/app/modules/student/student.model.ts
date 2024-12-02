import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  // TStudentModel,
  TUserName,
  // TStudentModel,
  // TStudentMethods,
} from './student.interface';

// Schema

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: `{VALUE} is not capitalize format `,
    },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'First name is required'],
  },
});
const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact no is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact no is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian contact number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian address is required'],
  },
});

const studentSchema = new Schema<TStudent>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: [true, 'User id is required'],
      ref: 'user',
    },

    name: {
      type: userNameSchema,
      required: [true, 'Student name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message:
          "The gender must be  one of the following 'male','female'or 'other'",
      },
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, 'Email  must be given'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number must be given'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Contact number must be given'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Address must be given'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Address must be given'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardia must be given'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian must be given'],
    },
    profileImg: {
      type: String,
      default: '',
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'academicSemester',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'academicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'academicFaculty',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// instance method
studentSchema.methods.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id: id });
  return existingUser;
};

// creating static method
// studentSchema.statics.isUserExist = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

// query middlware
// studentSchema.pre('find', function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });
studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});
export const Student = model<TStudent>('student', studentSchema);
