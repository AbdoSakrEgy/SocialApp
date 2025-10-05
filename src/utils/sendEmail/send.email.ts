import { createTransport, Transport } from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
    // tls: {
    //   rejectUnauthorized: false, // Only for development
    // },
  });
  try {
    const info = await transporter.sendMail({
      from: `"SochialApp" <${process.env.SENDER_EMAIL}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });
    const isEmailSended =
      Array.isArray(info?.accepted) && info.accepted.length > 0;
    return { isEmailSended, info };
  } catch (err) {
    return { isEmailSended: false, err: err + "" };
  }
};
