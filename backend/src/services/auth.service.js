import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { APP_URL, EMAIL_ADDRESS, SECRET_KEY } from "../config/env.js";
import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { generateSecureToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const registerService = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { rawToken, hashedToken } = generateSecureToken();

  await User.create({
    fullName,
    email,
    password: hashedPassword,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  const verificationUrl = `${APP_URL}/api/v1/auth/verify-email?token=${rawToken}`;

  try {
    await sendEmail({
      from: `Milan Kharel <${EMAIL_ADDRESS}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h1>Verify Your Email</h1>

        <p>Hello ${fullName},</p>

        <p>
          Please click the link below to verify your email address:
        </p>

        <a href="${verificationUrl}">
          Verify Email
        </a>

        <p>
          This link will expire in 24 hours.
        </p>
      `,
    });
  } catch (error) {
    console.error("failed to send verification email:", error.message);
  }

  return "Account created. Please verify your email.";
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Email not verified", 403);
  }

  const payload = { id: user._id, role: user.role };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  return { accessToken: token };
};

export const verifyEmailService = async (token) => {
  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  try {
    await sendEmail({
      from: `Milan Kharel <${EMAIL_ADDRESS}>`,
      to: user.email,
      subject: "Welcome!",
      html: `
        <h1>Welcome ${user.fullName}!</h1>

        <p>
          Your email has been successfully verified.
        </p>
      `,
    });
  } catch (error) {
    console.error("failed to send Welcome email:", error.message);
  }

  return "Email verified successfully";
};

export const changePasswordService = async () => {};

export const logoutService = async () => {};

export const forgotPasswordService = async () => {};

export const resetPasswordService = async () => {};

export const refreshTokenService = async () => {};
