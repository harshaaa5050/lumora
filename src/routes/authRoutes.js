import express from "express";
import {
	userRegistrationValidation,
	userLoginValidation,
} from "../validators/authValidator.js";
import { login, signup } from "../controllers/authController.js";

const authRouter = express.Router();

//Routing for users
authRouter.post("/signup", userRegistrationValidation, signup);
authRouter.post("/login", userLoginValidation, login);

export default authRouter;
