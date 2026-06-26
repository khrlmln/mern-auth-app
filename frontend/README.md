# AuthKit - Frontend

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

### 3. Start both servers

```bash
# Terminal 1 — backend
npm run dev

# Terminal 2 — frontend
npm run dev
```

Frontend runs at **http://localhost:5173** and Backend runs at **http://localhost:5000**

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

Token stored in `localStorage` and `cookies`:

- `accessToken` — short-lived JWT (15 min)
- `refreshToken` — long lived (30 days)

### Automatic refresh

When any authenticated request returns `401`, the axios interceptor:

1. Calls `POST /api/v1/auth/refresh-token` with the stored refresh token
2. Stores the new token
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