import Timer from "../models/UserDB/Timer.js";

export const logFocusSession = async (userId, duration) => {
	const timer = new Timer({ userId, duration, startTime: new Date() });
	return timer.save();
};

export const getTodayFocusSeconds = async (userId) => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const timers = await Timer.find({ userId, startTime: { $gte: start } });
	return timers.reduce((sum, t) => sum + t.duration, 0);
};
