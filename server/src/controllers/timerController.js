import { logFocusSession, getTodayFocusSeconds } from "../services/timerServices.js";

export const logSession = async (req, res) => {
	try {
		const { duration } = req.body;
		if (!duration || duration <= 0) {
			return res.status(400).json({ success: false, message: "Invalid duration" });
		}
		await logFocusSession(req.auth.userId, duration);
		res.status(201).json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getTodayFocus = async (req, res) => {
	try {
		const seconds = await getTodayFocusSeconds(req.auth.userId);
		res.status(200).json({ success: true, seconds });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
