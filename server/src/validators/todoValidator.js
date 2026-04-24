import { body, validationResult } from "express-validator";

export const taskCreationValidation = [
	body("title").trim().notEmpty().withMessage("Title is required"),

	body("description").optional().trim(),

	body("dueDate")
		.optional()
		.isISO8601()
		.withMessage("Due date must be a valid date")
		.bail()
		.custom((value) => {
			const due = new Date(value); due.setHours(0, 0, 0, 0);
			const today = new Date(); today.setHours(0, 0, 0, 0);
			if (due < today) throw new Error("Due date must be today or in the future");
			return true;
		}),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		next();
	},
];
