import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(30).required().messages({
    "string.empty": "fullName is required",
    "string.min": "fullName must be at least 3 characters long",
    "string.max": "fullName must be at most 30 characters long",
  }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      "string.empty": "email is required",
      "string.email": "please provide a valid email address",
    }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "password is required",
    "string.min": "password must be at least 8 characters long",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
