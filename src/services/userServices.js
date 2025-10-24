import User from "../models/UserDB/User.js";
import bcrypt from "bcrypt";

// Creates a new user in the User database
export const addNewUser = async (data) => {
  const { username, email, password } = data;

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    role: "user",
  });

  const user = await newUser.save();
  if (!user) throw new Error("Failed to create user");

  return user;
};

// Helper for validator
//Checks if username already exist
export const checkUsernameExistence = async (username) => {
  const existingUsername = await User.findOne({ username });
  return !!existingUsername;
};

// Helper for validator
//Checks if email already exist
export const checkEmailExistence = async (email) => {
  const existingEmail = await User.findOne({ email });
  return !!existingEmail;
};
