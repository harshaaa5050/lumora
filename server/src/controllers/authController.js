import { addNewUser, loginUser } from "../services/authServices.js";
import { generateToken } from "../utils/tokenUtils.js";

// User Signup
export const signup = async (req, res) => {
	try {
		const user = await addNewUser(req.body);
		const token = generateToken(user);
		const { username, email, role } = user;

		// Set token in HTTP-only cookie
		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("token", token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "strict",
		});

		res.status(201).json({
			status: "Success",
			message: "User registered successfully",
			data: { username, email, role },
		});
	} catch (error) {
		res.status(500).json({
			status: "Error",
			message: "User registration failed",
			error: error.message,
		});
	}
};

//user Login
export const login = async (req, res) => {
	try {
		const { identifier, password } = req.body;
		const { user, token } = await loginUser(identifier, password);

		// Set token in HTTP-only cookie
		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("token", token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "strict",
		});

		res.status(200).json({
			success: true,
			data: {
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Login failed",
			error: error.message,
		});
	}
};

// User LogOut
export const logout = async (req, res) => {
	try {
		// remove cookie
		const isProduction = process.env.NODE_ENV === "production";
		res.clearCookie("token", {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "strict",
		});
		res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
