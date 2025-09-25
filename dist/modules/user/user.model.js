"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.Role = exports.Gender = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("../../utils/bcrypt");
const crypto_1 = require("../../utils/crypto");
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
        set: (value) => (value ? (0, crypto_1.encrypt)(value) : value),
        get: (value) => (value ? (0, crypto_1.decrypt)(value) : value),
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
        type: mongoose_1.Types.ObjectId,
    },
    // others
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Mongoose lifecycle
// for create/save
userSchema.pre("save", async function (next) {
    // only hash if it's new
    if (this.emailOtp?.otp && this.isModified("emailOtp.otp")) {
        this.emailOtp.otp = await (0, bcrypt_1.hash)(this.emailOtp.otp);
    }
    if (this.newEmailOtp?.otp && this.isModified("newEmailOtp.otp")) {
        this.newEmailOtp.otp = await (0, bcrypt_1.hash)(this.newEmailOtp.otp);
    }
    if (this.password && this.isModified("password")) {
        this.password = await (0, bcrypt_1.hash)(this.password);
    }
    if (this.passwordOtp?.otp && this.isModified("passwordOtp.otp")) {
        this.passwordOtp.otp = await (0, bcrypt_1.hash)(this.passwordOtp.otp);
    }
});
// for findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();
        if (!update)
            return next();
        // Normalize to $set for easier handling
        const $set = update.$set || update;
        if ($set.password) {
            $set.password = await (0, bcrypt_1.hash)($set.password);
            // $set.credentialsChangedAt = new Date(Date.now());
        }
        if ($set["emailOtp.otp"]) {
            $set["emailOtp.otp"] = await (0, bcrypt_1.hash)($set["emailOtp.otp"]);
        }
        if ($set["newEmailOtp.otp"]) {
            $set["newEmailOtp.otp"] = await (0, bcrypt_1.hash)($set["newEmailOtp.otp"]);
        }
        if ($set["passwordOtp.otp"]) {
            $set["passwordOtp.otp"] = await (0, bcrypt_1.hash)($set["passwordOtp.otp"]);
        }
        if (!update.$set && $set !== update) {
            update.$set = $set;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
});
exports.UserModel = (0, mongoose_1.model)("user", userSchema);
