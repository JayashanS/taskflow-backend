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
import { authenticateJWT, checkAdminRole } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, checkAdminRole, createTask);
router.post(
  "/toggle/:taskId",
  authenticateJWT,
  checkAdminRole,
  toggleIsEnabled
);
router.post(
  "/update-user/:taskId",
  authenticateJWT,
  checkAdminRole,
  updateAssignedUser
);
router.patch("/complete/:taskId", authenticateJWT, markTaskAsCompleted);
router.get("/filter", authenticateJWT, checkAdminRole, getTasks);
router.get("/filter/user/:email", authenticateJWT, getTasksByUserEmail);
router.post("/many", insertTasks);
router.delete("/:taskId", authenticateJWT, checkAdminRole, deleteTask);
router.put("/:taskId", authenticateJWT, checkAdminRole, updateTask);

export default router;
