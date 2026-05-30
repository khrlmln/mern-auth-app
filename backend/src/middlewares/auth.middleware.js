import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";
import AppError from "../utils/AppError.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401);
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, SECRET_KEY);

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired token", 401);
  }
};

export default authenticate;
