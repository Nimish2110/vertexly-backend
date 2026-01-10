import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

export default router;
