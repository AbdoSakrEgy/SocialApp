import { model, Schema, Types } from "mongoose";
import { hash } from "../../utils/bcrypt";

export interface IUser {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  role: string;
  email: string;
  emailOtp: {
    otp: string;
    expiresIn: Date;
  };
  newEmail: string;
  newEmailOtp: {
    otp: string;
    expiresIn: Date;
  };
  emailConfirmed: boolean;
  password: string;
  passwordOtp: {
    otp: string;
    expiresIn: Date;
  };
  credentialsChangedAt: Date;
  isActive: boolean;
  deletedBy: object;
}
export const Gender = {
  male: "male",
  female: "female",
};
export const Role = {
  admin: "admin",
  customer: "customer",
  seller: "seller",
};
Object.freeze(Gender);
Object.freeze(Role);

const userSchema = new Schema<IUser>(
  {
    // personal info
    firstName: {
      type: String,
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name cannot exceed 20 characters"],
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name cannot exceed 20 characters"],
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 200,
    },
    gender: {
      type: String,
      default: Gender.male,
      enum: Object.values(Gender),
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^\+?[1-9]\d{7,14}$/.test(v.replace(/[\s-]/g, "")),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      // set: (value:string) => (value ? encrypt(value) : value),
      // get: (value:string) => (value ? decrypt(value) : value),
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.customer,
    },
    // auth and OTP
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailOtp: {
      otp: {
        type: String,
        // next code will cause error, so use mongoose lifecycle
        // set: async (value: string): Promise<string> => await hash(value),
      },
      expiresIn: Date,
    },
    newEmail: {
      type: String,
    },
    newEmailOtp: {
      otp: {
        type: String,
      },
      expiresIn: Date,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      min: 3,
      max: 20,
      required: true,
    },
    passwordOtp: {
      otp: {
        type: String,
      },
      expiresIn: Date,
    },
    credentialsChangedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedBy: {
      type: Types.ObjectId,
    },
    // others
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Mongoose lifecycle
userSchema.pre("save", async function (next) {
  // only hash if it's new or modified
  if (this.emailOtp?.otp && this.isModified("emailOtp.otp")) {
    this.emailOtp.otp = await hash(this.emailOtp.otp);
  }
  if (this.newEmailOtp?.otp && this.isModified("newEmailOtp.otp")) {
    this.newEmailOtp.otp = await hash(this.newEmailOtp.otp);
  }
  if (this.password && this.isModified("password")) {
    this.password = await hash(this.password);
  }
  if (this.passwordOtp?.otp && this.isModified("passwordOtp.otp")) {
    // this.passwordOtp.otp = await hash(this.passwordOtp.otp);
  }
});

export const UserModel = model<IUser>("user", userSchema);
