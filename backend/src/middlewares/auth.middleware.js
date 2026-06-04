import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";
import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401);
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(payload.id).select("+passwordChangedAt");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (
      user.passwordChangedAt &&
      payload.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      throw new AppError("Password recently changed. Please login again.", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired token", 401);
  }
};

export default authenticate;
