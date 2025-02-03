import express from "express";
import {
  createUser,
  inviteUser,
  getAllUsers,
  deleteAllUsers,
  resetPassword,
  login,
  getUsersWithPagination,
  createMultipleUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticateJWT, checkAdminRole } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", createUser);
router.get("/all", getAllUsers);
router.post("/invite", inviteUser);
router.delete("/all", authenticateJWT, checkAdminRole, deleteAllUsers);
router.post("/reset", resetPassword);
router.post("/login", login);
router.get("/all-from", getUsersWithPagination);
router.post("/many", createMultipleUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
