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
  const user = await loginService(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
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

  res.status(200).json({
    success: true,
    message,
  });
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
  const tokens = await refreshTokenService(req.body.refreshToken);

  res.status(200).json({
    success: true,
    data: tokens,
  });
});
