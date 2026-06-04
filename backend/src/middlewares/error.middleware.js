import { NODE_ENV } from "../config/env.js";

const errorMiddleware = (err, req, res, _next) => {
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      status: "fail",
      errors: err.details.map((detail) => detail.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      status: "fail",
      message: "Email already exists",
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message || "Internal Server Error",
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
