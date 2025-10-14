"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendRequestSchema = exports.sendFriendRequestSchema = exports.updateBasicInfoSchema = exports.deleteMultiFilesSchema = exports.createPresignedUrlToGetFileSchema = exports.uploadCoverImagesSchema = exports.uploadAvatarImageSchema = exports.uploadProfileVideoSchema = exports.uploadProfileImageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("./user.model");
const mongoose_1 = __importDefault(require("mongoose"));
exports.uploadProfileImageSchema = zod_1.default.object({
    profileImage: zod_1.default.object(),
});
exports.uploadProfileVideoSchema = zod_1.default.object({
    profileVideo: zod_1.default.object(),
});
exports.uploadAvatarImageSchema = zod_1.default.object({
    fileName: zod_1.default.string(),
    fileType: zod_1.default.string(),
});
exports.uploadCoverImagesSchema = zod_1.default.object({
    coverImages: zod_1.default.array(zod_1.default.object()),
});
exports.createPresignedUrlToGetFileSchema = zod_1.default.object({
    download: zod_1.default.boolean().optional(),
    downloadName: zod_1.default.string().optional(),
});
exports.deleteMultiFilesSchema = zod_1.default.object({
    Keys: zod_1.default.array(zod_1.default.string()),
    Quiet: zod_1.default.boolean().optional(),
});
exports.updateBasicInfoSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(3).max(50).optional(),
    lastName: zod_1.default.string().min(3).max(50).optional(),
    age: zod_1.default.number().min(18).max(200).optional(),
    gender: zod_1.default.literal([user_model_1.Gender.male, user_model_1.Gender.female]).optional(),
    phone: zod_1.default.string().optional(),
});
exports.sendFriendRequestSchema = zod_1.default.object({
    to: zod_1.default
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    })
        .transform((val) => new mongoose_1.default.Types.ObjectId(val)),
});
exports.acceptFriendRequestSchema = zod_1.default.object({
    friendRequestId: zod_1.default
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    })
        .transform((val) => new mongoose_1.default.Types.ObjectId(val)),
});
