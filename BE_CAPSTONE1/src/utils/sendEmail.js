import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // hoặc SMTP khác
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Clinic App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
