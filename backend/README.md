# MERN Authentication API

A production-inspired Authentication API built with Express.js, MongoDB, JWT, and Resend for email sending.

This project demonstrates modern backend development practices including layered architecture, validation, authentication, authorization, email verification, password reset, refresh token rotation, and centralized error handling.

🌐 **Live API:** https://authapi.milankharel.com.np

The API is publicly deployed and available for testing and integration.

---

## Features

### Authentication

- User Registration
- User Login
- JWT Access Tokens
- Refresh Token Rotation
- Logout

### Account Security

- Password Hashing with bcrypt
- Change Password
- Forgot Password
- Reset Password
- Password Change Session Revocation

### Email Verification

- Email Verification via Magic Link
- Resend Verification Email
- Welcome Email After Verification

### Validation & Error Handling

- Joi Request Validation
- Centralized Error Handling
- Custom AppError Utility
- Async Error Handling Middleware

### Security

- Helmet Security Headers
- CORS Configuration
- Hashed Refresh Tokens
- Hashed Verification Tokens
- Hashed Password Reset Tokens

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt

### Validation

- Joi

### Email

- Resend

### Security

- Helmet
- CORS

---

## Project Structure

```text
src/
│
├── config/
│   ├── database.js
│   └── env.js
│   └── arcjet.js
│
├── controllers/
│   └── auth.controller.js
│
├── docs/
│   ├── yaak-auth-api.json
│
├── middleware/
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── page-not-found.middleware.js
│   └── validate.middleware.js
│
├── models/
│   └── user.model.js
│
├── routes/
│   └── auth.route.js
│
├── services/
│   └── auth.service.js
│
├── utils/
│   ├── AppError.js
│   ├── async-handler.js
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── token.js
│
├── validators/
│   └── auth.validator.js
│
└── app.js

server.js
```

---

## Authentication Flow

### Registration

1. User registers with email and password.
2. Password is hashed using bcrypt.
3. Verification token is generated and hashed.
4. Verification email is sent to the user.
5. User account remains unverified until email verification.

---

### Email Verification

1. User clicks verification link.
2. Verification token is validated.
3. Account is marked as verified.
4. Verification token is removed.

---

### Login

1. User submits credentials.
2. Password is verified.
3. Access Token is generated.
4. Refresh Token is generated.
5. Refresh Token is hashed and stored in database.

---

### Refresh Token Rotation

1. Client sends refresh token.
2. Token hash is matched with database.
3. New access token is generated.
4. New refresh token is generated.
5. Old refresh token becomes invalid.

---

### Logout

1. Refresh token is removed from database.
2. Existing refresh token can no longer be used.

---

### Forgot Password

1. User submits email.
2. Password reset token is generated.
3. Password reset email is sent.

---

### Reset Password

1. User clicks reset link.
2. Reset token is validated.
3. New password is hashed and stored.
4. Existing refresh tokens are revoked.

---

## API Endpoints

### Authentication

| Method | Endpoint                               | Description               |
| ------ | -------------------------------------- | ------------------------- |
| POST   | /api/v1/auth/register                  | Register user             |
| POST   | /api/v1/auth/login                     | Login user                |
| GET    | /api/v1/auth/verify-email              | Verify email              |
| POST   | /api/v1/auth/resend-verification-email | Resend verification email |
| POST   | /api/v1/auth/forgot-password           | Send password reset email |
| POST   | /api/v1/auth/reset-password            | Reset password            |
| POST   | /api/v1/auth/refresh-token             | Rotate refresh token      |
| POST   | /api/v1/auth/logout                    | Logout user               |
| PATCH  | /api/v1/auth/change-password           | Change password           |

---

## Environment Variables

Rename a `.env.example` file to `.env` in the root directory.

```env
PORT=
APP_URL=
CLIENT_URL=
NODE_ENV=
DB_URL=
SECRET_KEY=
EMAIL_ADDRESS=
RESEND_API_KEY=
ARCJET_KEY=
```

---

## Installation

### Clone Repository

```bash
git clone https://gitlab.com/khrlmln/mern-auth-app.git
```

### Navigate Into Project

```bash
cd mern-auth-app
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## API Collection

A Yaak collection is included in the `docs` directory.

Import:

docs/yaak-auth-api.json

to quickly test all endpoints.
