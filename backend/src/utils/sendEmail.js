import nodemailer from "nodemailer";
import { EMAIL_ADDRESS, GOOGLE_APP_PASSWORD } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_ADDRESS,
    pass: GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async (mailInfo) => {
  return transporter.sendMail(mailInfo);
};
