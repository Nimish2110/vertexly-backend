import { Router } from "express";
import { registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/authController.js";
import { protect, AuthRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ FIXED PROFILE ROUTE
router.get("/profile", protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
