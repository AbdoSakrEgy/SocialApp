"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ to, subject, html, }) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.GOOGLE_APP_PASSWORD,
        },
    });
    try {
        const info = await transporter.sendMail({
            from: `"ECommerceApp" <${process.env.SENDER_EMAIL}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });
        const isEmailSended = Array.isArray(info?.accepted) && info.accepted.length > 0;
        return { isEmailSended, info };
    }
    catch (err) {
        return { isEmailSended: false, err };
    }
};
exports.sendEmail = sendEmail;
