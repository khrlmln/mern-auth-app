import { loginService, registerService } from "../services/auth.service.js";
import asyncHandler from "../utils/async-handler.js";

export const registerController = asyncHandler(async (req, res, _next) => {
  const user = await registerService(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const loginController = asyncHandler(async (req, res, _next) => {
  const user = await loginService(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const verifyEmailController = asyncHandler(async (req, res, _next) => {
  res
    .status(200)
    .json({ success: true, message: "verifyEmail controller called" });
});

export const getProfileController = asyncHandler(async (req, res, _next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export const changePasswordController = asyncHandler(
  async (req, res, _next) => {
    res
      .status(200)
      .json({ success: true, message: "changePassword controller called" });
  }
);

export const logoutController = asyncHandler(async (req, res, _next) => {
  res.status(200).json({ success: true, message: "logout controller called" });
});

export const forgotPasswordController = asyncHandler(
  async (req, res, _next) => {
    res
      .status(200)
      .json({ success: true, message: "forgotPassword controller called" });
  }
);

export const resetPasswordController = asyncHandler(async (req, res, _next) => {
  res
    .status(200)
    .json({ success: true, message: "resetPassword controller called" });
});

export const refreshTokenController = asyncHandler(async (req, res, _next) => {
  res
    .status(200)
    .json({ success: true, message: "refreshToken controller called" });
});
