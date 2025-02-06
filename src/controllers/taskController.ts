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

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { taskName, startDate, endDate, userId, status } = req.query;

    const filter: any = {};

    if (taskName) {
      filter.taskName = { $regex: taskName as string, $options: "i" };
    }

    if (startDate || endDate) {
      const dateFilter: any = {};

      if (startDate) {
        const start = new Date(startDate as string);
        if (!isNaN(start.getTime())) {
          dateFilter.$gte = start;
        }
      }

      if (endDate) {
        const end = new Date(endDate as string);
        if (!isNaN(end.getTime())) {
          dateFilter.$lte = end;
        }
      }

      if (Object.keys(dateFilter).length > 0) {
        filter.startDate = dateFilter;
      }
    }
    if (userId) {
      filter.assignedUser = userId as string;
    }

    if (status) {
      if (status === "inProgress") {
        filter.completionDate = { $exists: false };
      } else if (status === "completed") {
        filter.completionDate = { $exists: true };
      }
    }

    const tasks = await Task.find(filter).sort({ _id: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const insertTasks = async (req: Request, res: Response) => {
  try {
    const tasks = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ message: "Tasks array is required" });
    }
    const insertedTasks = await Task.insertMany(tasks);

    res.status(201).json({
      message: "Tasks inserted successfully",
      tasks: insertedTasks,
    });
  } catch (error) {
    console.error("Error inserting tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
