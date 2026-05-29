import express, { json } from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import pageNotFoundMiddleware from "./middlewares/page-not-found.middleware.js";
import router from "./routes/index.routes.js";

const app = express();
app.use(json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Authentication API");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "api running normally" });
});

app.use("/api/v1", router);

app.use(pageNotFoundMiddleware);
app.use(errorMiddleware);

export default app;
