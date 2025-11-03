import { HydratedDocument, model, Schema, Types } from "mongoose";
import { hash } from "../../utils/bcrypt";
import { decrypt, encrypt } from "../../utils/crypto";
import { ApplicationExpection } from "../../utils/Errors";
import { Gender, Role } from "../../types/user.module.types";

export interface IUser {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  role: string;
  email: string;
  emailOtp: { otp: string; expiresIn: Date };
  newEmail: string;
  newEmailOtp: { otp: string; expiresIn: Date };
  emailConfirmed: boolean;
  password: string;
  passwordOtp: { otp: string; expiresIn: Date };
  credentialsChangedAt: Date;
  isActive: boolean;
  deletedBy: object;
  profileImage: string;
  profileVideo: string;
  avatarImage: string;
  coverImages: string[];
  friends: Types.ObjectId[];
  blockList: Types.ObjectId[];
  is2FAActive: boolean;
  otp2FA: { otp: string; expiresIn: Date };
}

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
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [20, "Last name cannot exceed 20 characters"],
      required: true,
    },
    age: { type: Number, min: 18, max: 200 },
    gender: { type: String, default: Gender.male, enum: Object.values(Gender) },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^\+?[1-9]\d{7,14}$/.test(v.replace(/[\s-]/g, "")),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      set: (value: string) => (value ? encrypt(value) : value),
      get: (value: string) => (value ? decrypt(value) : value),
    },
    role: { type: String, enum: Object.values(Role), default: Role.customer },
    // auth and OTP
    email: { type: String, required: true, unique: true },
    emailOtp: {
      otp: {
        type: String,
        // next code will cause error, so use mongoose lifecycle
        // set: async (value: string): Promise<string> => await hash(value),
      },
      expiresIn: Date,
    },
    newEmail: { type: String },
    newEmailOtp: { otp: { type: String }, expiresIn: Date },
    emailConfirmed: { type: Boolean, default: false },
    password: { type: String, min: 3, max: 20, required: true },
    passwordOtp: { otp: { type: String }, expiresIn: Date },
    credentialsChangedAt: Date,
    isActive: { type: Boolean, default: true },
    deletedBy: { type: Types.ObjectId },
    // others
    profileImage: { type: String },
    profileVideo: { type: String },
    avatarImage: { type: String },
    coverImages: { type: [{ type: String }] },
    friends: { type: [{ type: Types.ObjectId, ref: "user" }] },
    blockList: { type: [{ type: Types.ObjectId, ref: "user" }] },
    is2FAActive: { type: Boolean, default: false },
    otp2FA: { otp: { type: String }, expiresIn: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// virtuals
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware (hooks) for hashing sensitive fields
// pre save
userSchema.pre(
  "save",
  async function (
    this: HydratedDocument<IUser> & { isFirstCreation: boolean },
    next
  ) {
    this.isFirstCreation = this.isNew;
    if (this.emailOtp && this.isModified("emailOtp")) {
      this.emailOtp = {
        otp: await hash(this.emailOtp?.otp),
        expiresIn: this.emailOtp?.expiresIn,
      };
    }
    if (this.newEmailOtp && this.isModified("newEmailOtp")) {
      this.newEmailOtp = {
        otp: await hash(this.newEmailOtp?.otp),
        expiresIn: this.newEmailOtp?.expiresIn,
      };
    }
    if (this.password && this.isModified("password")) {
      this.password = await hash(this.password);
    }
    if (this.passwordOtp && this.isModified("passwordOtp")) {
      this.passwordOtp = {
        otp: await hash(this.passwordOtp?.otp),
        expiresIn: this.passwordOtp?.expiresIn,
      };
    }
    if (this.otp2FA && this.isModified("otp2FA")) {
      this.otp2FA = {
        otp: await hash(this.otp2FA?.otp),
        expiresIn: this.otp2FA?.expiresIn,
      };
    }
  }
);

// pre findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update: any = this.getUpdate();
    if (!update) return next();

    // Normalize to $set for easier handling
    const $set = update.$set || update;

    if ($set["emailOtp.otp"]) {
      $set["emailOtp.otp"] = await hash($set["emailOtp.otp"]);
    }
    if ($set["newEmailOtp.otp"]) {
      $set["newEmailOtp.otp"] = await hash($set["newEmailOtp.otp"]);
    }
    if ($set.password) {
      $set.password = await hash($set.password);
    }
    if ($set["passwordOtp.otp"]) {
      $set["passwordOtp.otp"] = await hash($set["passwordOtp.otp"]);
    }
    if ($set?.otp2FA?.otp) {
      $set.otp2FA.otp = await hash($set.otp2FA.otp);
    }
    if (!update.$set && $set !== update) {
      update.$set = $set;
    }

    return next();
  } catch (error) {
    return next(error as any);
  }
});

// post save
userSchema.post("save", async function (doc, next) {
  // 'this' already has the passed data, but will not appear if logged it
  const that = this as HydratedDocument<IUser> & { isFirstCreation: boolean };
  console.log({ isFirstCreation: that.isFirstCreation, that: that });
});

export const UserModel = model<IUser>("user", userSchema);
