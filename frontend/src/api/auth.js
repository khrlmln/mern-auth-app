import api, { publicApi } from "./axios";

// POST /register — { fullName, email, password }
export const register = (body) => publicApi.post("/register", body);

// POST /login — { email, password } → { accessToken, refreshToken }
export const login = (body) => publicApi.post("/login", body);

// POST /logout — requires Bearer token
export const logout = () => api.post("/logout");

// GET /profile — returns current user object
export const getProfile = () => api.get("/profile");

// PATCH /change-password — { currentPassword, newPassword }
export const changePassword = (body) => api.patch("/change-password", body);

/*
 * GET /verify-email?token=
 * Called from the VerifyEmail page when the user lands with a token in the URL.
 * Uses publicApi so it doesn't require an auth header.
 */
export const verifyEmail = (token) =>
  publicApi.get(`/verify-email?token=${encodeURIComponent(token)}`);

// POST /resend-verification-email — { email }
export const resendVerificationEmail = (email) =>
  publicApi.post("/resend-verification-email", { email });

// POST /forgot-password — { email }
export const forgotPassword = (email) =>
  publicApi.post("/forgot-password", { email });

/**
 * POST /reset-password?token= — { password }
 * Token comes from query param in the reset email link.
 */
export const resetPassword = (token, password) =>
  publicApi.post(`/reset-password?token=${encodeURIComponent(token)}`, {
    password,
  });

// POST /refresh-token
export const refreshToken = () => publicApi.post("/refresh-token");
