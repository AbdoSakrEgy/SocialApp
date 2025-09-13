"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default
    .object({
    name: zod_1.default.string().min(3).max(15),
    email: zod_1.default.email(),
    password: zod_1.default.string().min(3).max(20),
    confirmPassword: zod_1.default.string().min(3).max(20),
})
    .superRefine((args, ctx) => {
    if (args.password != args.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "confirm password must be equal to password",
        });
    }
    if (args.email == "zzz@gmail.com") {
        ctx.addIssue({
            code: "custom",
            path: ["email"],
            message: "zzz@gmail.com not valid email to use :)",
        });
    }
});
