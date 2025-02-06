import express from "express";
import {
  createTask,
  toggleIsEnabled,
  updateAssignedUser,
  markTaskAsCompleted,
  getTasks,
  insertTasks,
} from "../controllers/taskController";

const router = express.Router();

router.post("/", createTask);
router.post("/toggle/:taskId", toggleIsEnabled);
router.post("/update-user/:taskId", updateAssignedUser);
router.post("/complete/:taskId", markTaskAsCompleted);
router.get("/filter", getTasks);
router.post("/many", insertTasks);

export default router;
