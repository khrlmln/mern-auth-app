import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, SECRET_KEY);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: (error.message = "Invalid or expired token"),
    });
  }
};

export default authenticate;
