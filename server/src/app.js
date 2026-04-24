import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { authenticate, isAdmin, isUser } from "./middlewares/authMiddleware.js";
import env from "./config/env.js";
import { communityAdminRouter, communityRouter } from "./routes/communityRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import { uploadFile, uploadMiddleware } from "./controllers/uploadController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const allowedOrigins = env.CLIENT_URL
	? env.CLIENT_URL.split(",").map((u) => u.trim())
	: ["http://localhost:5173"];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error(`CORS blocked: ${origin}`));
			}
		},
		credentials: true, // Allow cookies to be sent
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());
app.use(cookieParser());

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// File upload
app.post("/upload", authenticate, uploadMiddleware, uploadFile);

// User Routes
app.use("/auth", authRouter);
app.use("/user/community/admin", authenticate, isUser, communityAdminRouter);
app.use("/user/community", authenticate, isUser, communityRouter);
app.use("/user", authenticate, isUser, userRouter);

// AI Coach (no auth required for now — swap with authenticate later)
app.use("/ai", aiRouter);

// Admin Routes
app.use("/admin", authenticate, isAdmin, adminRouter);

export default app;
