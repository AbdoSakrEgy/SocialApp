"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatGroupMessageSchema = exports.chatMessageSchema = exports.createChatGroupSchema = exports.getChatSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdSchema = zod_1.default
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
})
    .transform((val) => new mongoose_1.default.Types.ObjectId(val));
exports.getChatSchema = zod_1.default.object({
    chatId: zod_1.default.string(),
});
exports.createChatGroupSchema = zod_1.default.object({
    groupName: zod_1.default.string(),
    participants: zod_1.default.array(objectIdSchema),
});
exports.chatMessageSchema = zod_1.default.object({
    content: zod_1.default.string().min(1).max(50),
    sendTo: zod_1.default.string(),
});
exports.chatGroupMessageSchema = zod_1.default.object({
    content: zod_1.default.string().min(1).max(50),
    groupId: zod_1.default.string(),
});
