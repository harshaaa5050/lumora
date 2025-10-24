import { addNewUser } from "../services/userServices.js";

// User Signup
const addUser = async (req, res, next) => {
  const { username, email, password, role } = await addNewUser(req.body);
  res.status(201).json({ status: "Sucess", data: { username, email, password, role } });
};

export default addUser;
