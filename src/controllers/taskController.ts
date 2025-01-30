import { Request, Response } from "express";
import Task from "../models/taskModel";

export const createTask = async (req: Request, res: Response) => {
  const { taskName, description, startDate, endDate, assignedUser, isEnabled } =
    req.body;
  try {
    const task = new Task({
      taskName,
      description,
      startDate,
      endDate,
      assignedUser,
      isEnabled,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Error creating task" });
  }
};
