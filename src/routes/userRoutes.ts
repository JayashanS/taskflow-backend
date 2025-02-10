import express from "express";
import {
  createFirstUser,
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
  checkEmail,
  getAllUsersIDs,
} from "../controllers/userController";
import { authenticateJWT, checkAdminRole } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create-first", createFirstUser);
router.post("/", authenticateJWT, checkAdminRole, createUser);
router.get("/all", authenticateJWT, checkAdminRole, getAllUsers);
router.post("/invite", authenticateJWT, checkAdminRole, inviteUser);
router.delete("/all", authenticateJWT, checkAdminRole, deleteAllUsers);
router.post("/reset", resetPassword);
router.post("/login", login);
router.get(
  "/all-from",
  authenticateJWT,
  checkAdminRole,
  getUsersWithPagination
);
router.post("/many", createMultipleUsers);
router.put("/update/:id", authenticateJWT, checkAdminRole, updateUser);
router.delete("/delete/:id", authenticateJWT, checkAdminRole, deleteUser);
router.get("/all-ids", authenticateJWT, checkAdminRole, getAllUserIds);
router.get("/filter", authenticateJWT, checkAdminRole, getUsersByFilter);
router.post(
  "/toggle/:userId",
  authenticateJWT,
  checkAdminRole,
  toggleIsEnabled
);
router.get("/search", searchUser);
router.post("/check-email", checkEmail);
router.get("/id", getAllUsersIDs);

export default router;
