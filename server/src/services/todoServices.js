import mongoose from "mongoose";
import Todo from "../models/UserDB/Todo.js";
import Task from "../models/UserDB/Todo.js";
import CompletedTodo from "../models/UserDB/CompletedTodo.js";
import UserMetadata from "../models/UserDB/UserMetadata.js";

//Adds new todo
export const addNewTodo = async (data) => {
	const { userId, title, description, dueDate } = data;

	const newTodo = new Task({ userId, title, description, dueDate });
	const todo = await newTodo.save();
	if (!todo) throw new Error("Failed to create Todo");

	// Update UserMetadata
	const newUserMetadata = await UserMetadata.findOne({ userId });
	if (!newUserMetadata) {
		deleteTodoById(todo._id);
		throw new Error("Failed to find user metadata");
	}
	newUserMetadata.todos.push(todo._id);
	const userMetadata = await newUserMetadata.save();
	if (!userMetadata) {
		deleteTodoById(todo._id);
		throw new Error("Failed to save todo in user metadata");
	}
	return todo;
};

// Edit Todo
export const editExistingTodo = async (data, todoId) => {
	const todo = await Todo.findOne({ _id: todoId });
	if (!todo) throw new Error("404 Todo not Found");

	const { title, description, dueDate } = data;
	todo.title = title;
	todo.description = description;
	todo.dueDate = dueDate;

	const editedTodo = await todo.save();
	if (!editedTodo) throw new Error("Failed to edit Todo list");
	return editedTodo;
};

// Delete Todo (handles both active and completed)
export const deleteExistingTodo = async (todoId) => {
	const todo = await Todo.findById(todoId);
	if (todo) {
		await deleteTodoReference(todo.userId, todo._id);
		await deleteTodoById(todo._id);
		return;
	}

	const completed = await CompletedTodo.findById(todoId);
	if (completed) {
		const userMetadata = await UserMetadata.findOne({ userId: completed.userId });
		if (userMetadata) {
			userMetadata.completedTodos = userMetadata.completedTodos.filter(id => id.toString() !== todoId.toString());
			await userMetadata.save();
		}
		await CompletedTodo.findByIdAndDelete(todoId);
		return;
	}

	throw new Error("404 Todo not Found");
};

async function deleteTodoReference(userId, todoId) {
	const userMetadata = await UserMetadata.findOne({ userId });
	if (!userMetadata) throw new Error("404 UserMetadata not Found");

	userMetadata.todos = userMetadata.todos.filter((id) => id.toString() !== todoId.toString());
	const newUserMetadata = await userMetadata.save();
	if (!newUserMetadata) throw new Error("Failed to update newUserMetadata todo reference");
}

async function deleteTodoById(todoId) {
	const deleted = await Todo.findByIdAndDelete(todoId);
	if (!deleted) throw new Error("Failed to delete Todo");
}

// Get all active Todos of a user
export const getAllTodoOfUser = async (userId) => {
	const userMetadata = await UserMetadata.findOne({ userId }).populate("todos");
	if (!userMetadata) throw new Error("404 Todos not Found");
	return userMetadata.todos;
};

// Get all completed Todos of a user
export const getAllCompletedTodosOfUser = async (userId) => {
	const userMetadata = await UserMetadata.findOne({ userId }).populate("completedTodos");
	if (!userMetadata) throw new Error("404 User metadata not Found");
	return userMetadata.completedTodos;
};

// Mark Todo as completed (toggle) — moves document between collections
export const markTodoAsCompleted = async (todoId, userId) => {
	const id = new mongoose.Types.ObjectId(todoId);

	// ── Active → Completed ──────────────────────────────────────────
	const activeTodo = await Todo.findById(id);
	if (activeTodo) {
		await CompletedTodo.create({
			_id:         activeTodo._id,
			userId:      activeTodo.userId,
			title:       activeTodo.title,
			description: activeTodo.description,
			dueDate:     activeTodo.dueDate,
		});
		await Todo.findByIdAndDelete(id);

		// Read current streak state
		const meta = await UserMetadata.findOne({ userId }, "streakCount maxStreakCount lastTodoCompletionDate");
		if (!meta) throw new Error("User metadata not found");

		let newStreak = meta.streakCount || 0;
		const last    = meta.lastTodoCompletionDate;
		if (last) {
			const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
			const lastStart  = new Date(last); lastStart.setHours(0, 0, 0, 0);
			const diff = Math.round((todayStart - lastStart) / 86400000);
			if (diff === 1)     newStreak += 1;
			else if (diff > 1)  newStreak  = 1;
			// diff === 0 → already completed today, streak unchanged
		} else {
			newStreak = 1;
		}
		const newMax = Math.max(newStreak, meta.maxStreakCount || 0);

		// Single atomic update — bypasses Mongoose dirty-tracking entirely
		await UserMetadata.findOneAndUpdate(
			{ userId },
			{
				$pull:  { todos: id },
				$push:  { completedTodos: id },
				$set:   { streakCount: newStreak, maxStreakCount: newMax, lastTodoCompletionDate: new Date() },
			}
		);
		return;
	}

	// ── Completed → Active ──────────────────────────────────────────
	const completedTodo = await CompletedTodo.findById(id);
	if (!completedTodo) throw new Error("Todo does not exist");

	await Todo.create({
		_id:         completedTodo._id,
		userId:      completedTodo.userId,
		title:       completedTodo.title,
		description: completedTodo.description,
		dueDate:     completedTodo.dueDate,
		isCompleted: false,
	});
	await CompletedTodo.findByIdAndDelete(id);

	await UserMetadata.findOneAndUpdate(
		{ userId },
		{
			$pull: { completedTodos: id },
			$push: { todos: id },
		}
	);
};
