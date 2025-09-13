import { model, Schema } from "mongoose";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailOtp: {
    otp: string;
    expireAt: Date;
  };
  phone: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailOtp: {
      otp: String,
      expireAte: Date,
    },
    phone: Number,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const userModel = model<IUser>("user", userSchema);
