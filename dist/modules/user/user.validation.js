"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultiFilesSchema = exports.createPresignedUrlToGetFileSchema = exports.uploadAvatarImageSchema = exports.updateBasicInfoSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("./user.model");
exports.updateBasicInfoSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(3).max(50).optional(),
    lastName: zod_1.default.string().min(3).max(50).optional(),
    age: zod_1.default.number().min(18).max(200).optional(),
    gender: zod_1.default.literal([user_model_1.Gender.male, user_model_1.Gender.female]).optional(),
    phone: zod_1.default.string().optional(),
});
exports.uploadAvatarImageSchema = zod_1.default.object({
    fileName: zod_1.default.string(),
    fileType: zod_1.default.string(),
});
exports.createPresignedUrlToGetFileSchema = zod_1.default.object({
    download: zod_1.default.boolean().optional(),
    downloadName: zod_1.default.string().optional(),
});
exports.deleteMultiFilesSchema = zod_1.default.object({
    Keys: zod_1.default.array(zod_1.default.string()),
    Quiet: zod_1.default.boolean().optional(),
});
