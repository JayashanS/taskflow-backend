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

export const toggleIsEnabled = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.isEnabled = !task.isEnabled;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: "Error updating task" });
  }
};

export const updateAssignedUser = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { assignedUser } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.assignedUser = assignedUser;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: "Error updating task" });
  }
};

export const markTaskAsCompleted = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.completionDate = new Date();
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: "Error updating task" });
  }
};
