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
  getAllUserIds,
  getUsersByFilter,
  toggleIsEnabled,
  searchUser,
  getAllUsersIDs,
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
router.get("/all-ids", getAllUserIds);
router.get("/filter", getUsersByFilter);
router.post("/toggle/:userId", toggleIsEnabled);
router.post("/search", searchUser);
router.get("/id", getAllUsersIDs);

export default router;
