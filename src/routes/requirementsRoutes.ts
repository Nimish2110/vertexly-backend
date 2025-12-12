import { Router } from "express";
import { submitRequirements } from "../controllers/requirementsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// PUT /api/orders/:orderId/requirements
router.put("/:orderId/requirements", protect, submitRequirements);

export default router;
