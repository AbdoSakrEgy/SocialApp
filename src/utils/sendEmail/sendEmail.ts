import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
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
    const isEmailSended =
      Array.isArray(info?.accepted) && info.accepted.length > 0;
    return { isEmailSended, info };
  } catch (err) {
    return { isEmailSended: false, err };
  }
};
