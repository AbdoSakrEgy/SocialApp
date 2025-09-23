import { EventEmitter } from "events";
import Mail from "nodemailer/lib/mailer";
import { ApplicationExpection } from "../Errors";
import { sendEmail } from "./send.email";

export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  to: string;
  subject: string;
  html: string;
}

emailEvent.on("sendEmail", async (emailStructure: IEmail) => {
  const { isEmailSended, info } = await sendEmail({
    to: emailStructure.to,
    subject: emailStructure.subject,
    html: emailStructure.html,
  });
  if (!isEmailSended) {
    throw new ApplicationExpection("Error while sending email", 400);
  }
});
