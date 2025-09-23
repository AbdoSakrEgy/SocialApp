"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const events_1 = require("events");
const Errors_1 = require("../Errors");
const send_email_1 = require("./send.email");
exports.emailEvent = new events_1.EventEmitter();
exports.emailEvent.on("sendEmail", async (emailStructure) => {
    const { isEmailSended, info } = await (0, send_email_1.sendEmail)({
        to: emailStructure.to,
        subject: emailStructure.subject,
        html: emailStructure.html,
    });
    if (!isEmailSended) {
        throw new Errors_1.ApplicationExpection("Error while sending email", 400);
    }
});
