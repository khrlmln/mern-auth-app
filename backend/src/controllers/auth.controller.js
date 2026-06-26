import { REFRESH_TOKEN_TTL_MS } from "../config/env.js";
import {
  changePasswordService,
  forgotPasswordService,
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
  resendVerificationEmailService,
  resetPasswordService,
  verifyEmailService,
} from "../services/auth.service.js";
import asyncHandler from "../utils/async-handler.js";

export const registerController = asyncHandler(async (req, res, _next) => {
  const message = await registerService(req.body);

  res.status(201).json({
    success: true,
    message,
  });
});

export const loginController = asyncHandler(async (req, res, _next) => {
  const { accessToken, refreshToken } = await loginService(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: REFRESH_TOKEN_TTL_MS,
    path: "/",
  });

  res.status(200).json({ success: true, data: { accessToken } });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const message = await verifyEmailService(req.query.token);

  res.status(200).json({
    success: true,
    message,
  });
});

export const resendVerificationEmailController = asyncHandler(
  async (req, res) => {
    const message = await resendVerificationEmailService(req.body.email);

    res.status(200).json({
      success: true,
      message,
    });
  }
);

export const getProfileController = asyncHandler(async (req, res, _next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const message = await changePasswordService({
    userId: req.user.id,
    ...req.body,
  });

  res.status(200).json({
    success: true,
    message,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const message = await logoutService(req.user.id);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({ success: true, message });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const message = await forgotPasswordService(req.body.email);

  res.status(200).json({
    success: true,
    message,
  });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const message = await resetPasswordService({
    token: req.query.token,
    password: req.body.password,
  });

  res.status(200).json({
    success: true,
    message,
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token missing" });
  }

  const { accessToken, refreshToken } = await refreshTokenService(token);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: REFRESH_TOKEN_TTL_MS,
    path: "/",
  });

  res.status(200).json({ success: true, data: { accessToken } });
});
