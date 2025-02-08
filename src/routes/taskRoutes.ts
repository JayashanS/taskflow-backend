import express from "express";
import {
  createTask,
  toggleIsEnabled,
  updateAssignedUser,
  markTaskAsCompleted,
  getTasks,
  getTasksByUserEmail,
  insertTasks,
  deleteTask,
  updateTask,
} from "../controllers/taskController";

const router = express.Router();

router.post("/", createTask);
router.post("/toggle/:taskId", toggleIsEnabled);
router.post("/update-user/:taskId", updateAssignedUser);
router.patch("/complete/:taskId", markTaskAsCompleted);
router.get("/filter", getTasks);
router.get("/filter/user/:email", getTasksByUserEmail);
router.post("/many", insertTasks);
router.delete("/:taskId", deleteTask);
router.put("/:taskId", updateTask);

export default router;
