import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoutes.js";
import env from "./config/env.js";

const app = express();

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// User Routes
app.use('/auth', authRouter);

export default app;
