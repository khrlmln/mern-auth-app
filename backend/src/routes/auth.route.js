import { Router } from "express";

import {
  changePasswordController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller.js";

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

authRoute.get("/profile", getProfileController);

authRoute.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePasswordController
);

authRoute.post("/logout", logoutController);

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

authRoute.post("/refresh-token", refreshTokenController);

export default authRoute;
