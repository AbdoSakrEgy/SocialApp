"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.Role = exports.Gender = void 0;
const mongoose_1 = require("mongoose");
exports.Gender = {
    male: "male",
    female: "female",
};
exports.Role = {
    admin: "admin",
    customer: "customer",
    seller: "seller",
};
Object.freeze(exports.Gender);
Object.freeze(exports.Role);
const userSchema = new mongoose_1.Schema({
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
        default: exports.Gender.male,
        enum: Object.values(exports.Gender),
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
        enum: Object.values(exports.Role),
        default: exports.Role.customer,
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
        type: mongoose_1.Types.ObjectId,
    },
    // others
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Mongoose lifecycle
userSchema.pre("save", async function (next) {
    // only hash if it's new or modified
    if (this.emailOtp?.otp && this.isModified("emailOtp.otp")) {
        // this.emailOtp.otp = await hash(this.emailOtp.otp);
    }
    if (this.newEmailOtp?.otp && this.isModified("newEmailOtp.otp")) {
        // this.newEmailOtp.otp = await hash(this.newEmailOtp.otp);
    }
    if (this.password && this.isModified("password")) {
        // this.password = await hash(this.password);
    }
    if (this.passwordOtp?.otp && this.isModified("passwordOtp.otp")) {
        // this.passwordOtp.otp = await hash(this.passwordOtp.otp);
    }
});
exports.UserModel = (0, mongoose_1.model)("user", userSchema);
