import { Router } from "express";
import { registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✔ Protected route example
router.get("/profile", protect, (req: any, res) => {
  res.json(req.user);
});


export default router;
