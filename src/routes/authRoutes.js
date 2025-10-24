import express from "express";
import userRegistrationValidation from "../validators/userValidator.js";
import addUser from "../controllers/userController.js";

const authRouter = express.Router();

//Routing for users
authRouter.post("/signup", userRegistrationValidation, addUser);

export default authRouter;
