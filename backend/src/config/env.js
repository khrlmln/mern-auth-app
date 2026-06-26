import "dotenv/config";

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const {
  PORT,
  APP_URL,
  APP_NAME,
  CLIENT_URL,
  NODE_ENV,
  DB_URL,
  SECRET_KEY,
  EMAIL_ADDRESS,
  RESEND_API_KEY,
  ARCJET_KEY,
} = process.env;
