import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "15m",
  });
};
