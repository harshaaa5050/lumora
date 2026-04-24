import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
	filename: (_req, file, cb) => {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
		cb(null, unique + path.extname(file.originalname));
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

export const uploadMiddleware = upload.single("file");

export const uploadFile = (req, res) => {
	if (!req.file) return res.status(400).json({ success: false, error: "No file provided" });

	const url = `/api/uploads/${req.file.filename}`;
	res.status(200).json({
		success: true,
		url,
		filename: req.file.originalname,
		size: req.file.size,
		mimeType: req.file.mimetype,
		type: req.file.mimetype.startsWith("image/")
			? "image"
			: req.file.mimetype.startsWith("video/")
			? "video"
			: req.file.mimetype.startsWith("audio/")
			? "audio"
			: "file",
	});
};
