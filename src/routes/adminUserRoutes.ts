import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsersAdmin } from "../controllers/adminUserController.js";
import { getSingleUserAdmin } from "../controllers/adminUserController.js";
import { updateUserAdmin } from "../controllers/adminUserController.js";
import { deleteUserAdmin, restoreUser } from "../controllers/adminUserController.js";

const router = Router();

// GET /api/admin/users
router.get("/", protect, adminOnly, getAllUsersAdmin);
// GET /api/admin/users/:userId
router.get("/:userId", protect, adminOnly, getSingleUserAdmin);
// PUT /api/admin/users/:userId
router.put("/:userId", protect, adminOnly, updateUserAdmin);
router.delete("/:userId", protect, adminOnly, deleteUserAdmin);
router.patch("/:userId/restore", protect, adminOnly, restoreUser);
export default router;
