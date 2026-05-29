import express, { json } from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import pageNotFoundMiddleware from "./middlewares/pageNotFound.middleware.js";

const app = express();

app.use(json());

app.use("/health", (req, res) => {
  res.status(200).json({ success: true, message: "api is running normally" });
});

app.use("", pageNotFoundMiddleware);
app.use(errorMiddleware);

export default app;
