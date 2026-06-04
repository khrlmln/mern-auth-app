import bcrypt from "bcrypt";
import crypto from "crypto";
import { APP_URL, EMAIL_ADDRESS } from "../config/env.js";
import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { generateSecureToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateAccessToken } from "../utils/token.js";

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

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const { rawToken: refreshToken, hashedToken } = generateSecureToken();

  user.refreshToken = hashedToken;
  user.refreshTokenExpires = Date.now() + 30 * 24 * 60 * 60 * 1000;

  await user.save();

  return {
    accessToken,
    refreshToken,
  };
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

export const resendVerificationEmailService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email already verified", 400);
  }

  const { rawToken, hashedToken } = generateSecureToken();

  user.emailVerificationToken = hashedToken;

  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  const verificationUrl = `${APP_URL}/api/v1/auth/verify-email?token=${rawToken}`;

  await sendEmail({
    from: `Milan Kharel <${EMAIL_ADDRESS}>`,
    to: user.email,
    subject: "Verify Your Email Address",
    html: `
        <h1>Verify Your Email</h1>
        <a href="${verificationUrl}">
          Verify Email
        </a>
      `,
  });

  return "Verification email sent successfully";
};

export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError("Current password is incorrect", 401);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400
    );
  }

  user.password = await bcrypt.hash(newPassword, 12);

  user.passwordChangedAt = new Date();

  await user.save();

  return "Password changed successfully";
};

export const logoutService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.refreshToken = undefined;

  await user.save();

  return "Logged out successfully";
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return "If an account exists, a password reset link has been sent.";
  }

  const { rawToken, hashedToken } = generateSecureToken();

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `${APP_URL}/api/v1/auth/reset-password?token=${rawToken}`;

  try {
    await sendEmail({
      from: `Milan Kharel <${EMAIL_ADDRESS}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h1>Password Reset Request</h1>

        <p>Hello ${user.fullName},</p>

        <p>
          Click the link below to reset your password:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you didn't request this,
          you can safely ignore this email.
        </p>
      `,
    });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    throw new AppError("Failed to send password reset email", 500);
  }

  return "If an account exists, a password reset link has been sent.";
};

export const resetPasswordService = async ({ token, password }) => {
  if (!token) {
    throw new AppError("Reset token is required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;

  user.passwordResetToken = undefined;
  user.refreshToken = undefined;
  user.passwordResetExpires = undefined;

  user.passwordChangedAt = new Date();

  await user.save();

  return "Password reset successfully";
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const user = await User.findOne({
    refreshToken: hashedToken,
    refreshTokenExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const { rawToken: newRefreshToken, hashedToken: newHashedToken } =
    generateSecureToken();

  user.refreshToken = newHashedToken;

  await user.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
