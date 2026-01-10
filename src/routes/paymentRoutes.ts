import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/paymentController.js";

const router = Router();

// Create Razorpay order
router.post("/create-order", protect, createRazorpayOrder);

// Verify Razorpay payment
router.post("/verify", protect, verifyRazorpayPayment);

export default router;
