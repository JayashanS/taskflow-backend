import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
const port = process.env.PORT || 5000;

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: `http://localhost:${process.env.FE_PORT}` }));

console.log("Starting TaskFlow server and connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() =>
    app.listen(port, () =>
      console.log(`TaskFlow server running on port ${port}`)
    )
  )
  .catch((err) => console.error("MongoDB connection error", err));

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
