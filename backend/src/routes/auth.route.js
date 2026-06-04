import { Router } from "express";

import {
  changePasswordController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerificationEmailController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

const authRoute = Router();

authRoute.post("/register", validate(registerSchema), registerController);

authRoute.post("/login", validate(loginSchema), loginController);

authRoute.get("/verify-email", verifyEmailController);

authRoute.get("/profile", authenticate, getProfileController);

authRoute.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePasswordController
);

authRoute.post("/logout", authenticate, logoutController);

authRoute.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController
);

authRoute.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController
);

authRoute.post("/resend-verification-email", resendVerificationEmailController);

authRoute.post("/refresh-token", refreshTokenController);

export default authRoute;
