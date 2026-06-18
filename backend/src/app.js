import cors from "cors";
import express, { json } from "express";
import helmet from "helmet";
import { CLIENT_URL } from "./config/env.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import pageNotFoundMiddleware from "./middlewares/page-not-found.middleware.js";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(json());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Authentication API");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "api running normally" });
});

app.use("/api/v1/auth", authRoute);

app.use(pageNotFoundMiddleware);
app.use(errorMiddleware);

export default app;
