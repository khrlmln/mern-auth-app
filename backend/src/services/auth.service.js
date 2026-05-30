import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";
import { User } from "../models/user.model.js";

export const registerService = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const userObj = user.toJSON();
  delete userObj.password;

  return userObj;
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid Email or Password.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  const payload = { id: user._id, role: user.role };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  return { accessToken: token };
};

export const verifyEmailService = async () => {};

export const getProfileService = async () => {};

export const changePasswordService = async () => {};

export const logoutService = async () => {};

export const forgotPasswordService = async () => {};

export const resetPasswordService = async () => {};

export const refreshTokenService = async () => {};
