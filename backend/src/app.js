import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  })
);

// common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// import routes
import healthcheckrouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

// routes

app.use("/api/v1/healthcheck", healthcheckrouter);
app.use("/api/v1/users", userRouter);

// error handler

app.use(errorHandler);

export { app };
