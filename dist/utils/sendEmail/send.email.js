"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const sendEmail = async ({ to, subject, html, }) => {
    const transporter = (0, nodemailer_1.createTransport)({
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
