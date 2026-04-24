import express from "express";
import { taskCreationValidation } from "../validators/todoValidator.js";
import { addTodo, completeTodo, deleteTodo, editTodo, getAllTodo, getAllCompletedTodo } from "../controllers/todoController.js";
import { reportValidation } from "../validators/userValidator.js";
import { getUserProfile, getJoinedCommunities, getPublicCommunities, reportCommunity, reportUser } from "../controllers/userController.js";
import { logSession, getTodayFocus } from "../controllers/timerController.js";

const userRouter = express.Router();

// Profile
userRouter.get("/profile", getUserProfile);
userRouter.get("/communities", getJoinedCommunities);
userRouter.get("/public-communities", getPublicCommunities);

// Task routes
userRouter
	.route("/todo")
	.post(taskCreationValidation, addTodo)
	.get(getAllTodo);
userRouter.get("/todo/completed", getAllCompletedTodo);   // must be before /:todoId
userRouter.patch("/todo/completed/:todoId", completeTodo);
userRouter
	.route("/todo/:todoId")
	.put(taskCreationValidation, editTodo)
	.delete(deleteTodo);
// Timer routes
userRouter.post("/timer/log", logSession);
userRouter.get("/timer/today", getTodayFocus);

userRouter.post("/report-user/:communityId/:reportedUserId", reportValidation, reportUser);
userRouter.post("/report-community/:communityId", reportValidation, reportCommunity);

export default userRouter;
