# AuthKit — Frontend

A complete React frontend for the MERN authentication backend. Built with **React 19**, **Vite**, **TailwindCSS v4**, and a custom shadcn-style component library.

---

## Features

| Feature                   | Route                    |
| ------------------------- | ------------------------ |
| Register                  | `/register`              |
| Login                     | `/login`                 |
| Email verification        | `/verify-email?token=`   |
| Resend verification email | `/resend-verification`   |
| Forgot password           | `/forgot-password`       |
| Reset password            | `/reset-password?token=` |
| Dashboard (profile)       | `/dashboard`             |
| Change password           | `/change-password`       |

- 🔄 **Silent token refresh** — access tokens (15 min) are refreshed automatically using stored refresh tokens (30 days)
- 🌙 **Dark mode** — respects system preference, persisted to `localStorage`
- 🛡️ **Route guards** — protected routes redirect unauthenticated users to `/login`
- 📱 **Responsive** — works on all screen sizes

---

## Quick Start

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure the backend

In your backend `.env`, set:

```env
PORT=5000
APP_URL=http://localhost:5173   # ← frontend URL (used in email links)
CLIENT_URL=http://localhost:5173
```

### 3. Update the backend email templates (important)

The backend currently builds email links using `/api/v1/auth/...` paths. Update the two lines in `src/services/auth.service.js` to use clean frontend paths:

```js
// Email verification — change this line:
const verificationUrl = `${APP_URL}/api/v1/auth/verify-email?token=${rawToken}`;
// ↓ to:
const verificationUrl = `${APP_URL}/verify-email?token=${rawToken}`;

// Password reset — change this line:
const resetUrl = `${APP_URL}/api/v1/auth/reset-password?token=${rawToken}`;
// ↓ to:
const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;
```

This routes users who click email links to the frontend pages (which then call the backend API) instead of the raw API endpoints.

### 4. Start both servers

```bash
# Terminal 1 — backend (from backend directory)
npm run dev

# Terminal 2 — frontend
npm run dev
```

Frontend runs at **http://localhost:5173**. API calls to `/api/*` are proxied to `http://localhost:5000` by Vite.

---

## Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance with auth headers + token refresh interceptor
│   └── auth.js           # All API functions (register, login, logout, etc.)
├── components/
│   ├── layout/
│   │   └── AuthLayout.jsx    # Split-screen layout for auth pages
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── index.jsx         # Label, Alert, Badge, Card, Separator
│   ├── ProtectedRoute.jsx    # Redirects to /login if not authenticated
│   ├── PublicRoute.jsx       # Redirects to /dashboard if already logged in
│   └── ThemeToggle.jsx
├── contexts/
│   └── AuthContext.jsx       # Global auth state (user, login, logout, refreshUser)
├── lib/
│   └── utils.js              # cn(), getErrorMessage(), formatDate()
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── VerifyEmail.jsx
    ├── ResendVerification.jsx
    ├── ForgotPassword.jsx
    ├── ResetPassword.jsx
    ├── Dashboard.jsx
    ├── ChangePassword.jsx
    └── NotFound.jsx
```

---

## Authentication Flow

### Token storage

Tokens are stored in `localStorage`:

- `accessToken` — short-lived JWT (15 min)
- `refreshToken` — long-lived opaque token (30 days)

> **Security note:** For production, consider moving the refresh token to an `httpOnly` cookie (requires a backend change to set `Set-Cookie`). This protects against XSS attacks.

### Automatic refresh

When any authenticated request returns `401`, the axios interceptor:

1. Calls `POST /api/v1/auth/refresh-token` with the stored refresh token
2. Stores the new token pair
3. Retries the original request
4. If refresh fails, clears tokens and fires `auth:logout` event → user is redirected to login

### Protected routes

`<ProtectedRoute>` reads `isAuthenticated` from `AuthContext`. While auth state is loading (checking `localStorage` token on first render), a spinner is shown. Once resolved, unauthenticated users are redirected to `/login` with the intended path saved in `location.state.from`.

---

## Design System

Uses the Tailwind CSS v4 custom token system with:

- `--background`, `--foreground`, `--primary`, `--muted`, `--border`, etc.
- All tokens automatically flip between light and dark values when the `dark` class is on `<html>`
- Fonts: `Geist` (sans), `Geist Mono` (mono), `Georgia` (serif)

---

## API Reference

All endpoints are proxied through Vite to `http://localhost:5000`.

| Method  | Path                                     | Auth   | Body / Params                      |
| ------- | ---------------------------------------- | ------ | ---------------------------------- |
| `POST`  | `/api/v1/auth/register`                  | —      | `{ fullName, email, password }`    |
| `POST`  | `/api/v1/auth/login`                     | —      | `{ email, password }`              |
| `GET`   | `/api/v1/auth/verify-email`              | —      | `?token=`                          |
| `POST`  | `/api/v1/auth/resend-verification-email` | —      | `{ email }`                        |
| `GET`   | `/api/v1/auth/profile`                   | Bearer | —                                  |
| `PATCH` | `/api/v1/auth/change-password`           | Bearer | `{ currentPassword, newPassword }` |
| `POST`  | `/api/v1/auth/logout`                    | Bearer | —                                  |
| `POST`  | `/api/v1/auth/forgot-password`           | —      | `{ email }`                        |
| `POST`  | `/api/v1/auth/reset-password`            | —      | `?token=`, body `{ password }`     |
| `POST`  | `/api/v1/auth/refresh-token`             | —      | `{ refreshToken }`                 |
