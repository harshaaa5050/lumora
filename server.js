import express from "express";
import dotenv from "dotenv";
import { connectAdminDB, connectCommunityDB, connectUserDB } from "./src/config/db.js";

dotenv.config({ quiet: true });
const app = express();

// Connect to all databases
const connectDatabases = async () => {
  await connectUserDB();
  await connectCommunityDB();
  await connectAdminDB();
};

const PORT = process.env.PORT || 3000;

// Start server after database connections
const startServer = async () => {
  try {
    await connectDatabases();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Hello, Lumora!");
});
