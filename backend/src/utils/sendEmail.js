import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/env.js";

const resend = new Resend(RESEND_API_KEY);

export const sendEmail = async (mailInfo) => {
  const { from, to, subject, html } = mailInfo;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
