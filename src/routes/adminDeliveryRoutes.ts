import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";                 // <- named import
import { uploadDelivery } from "../controllers/adminDeliveryController.js"; // <- create this

const router = Router();

// PATCH /api/admin/orders/:orderId/delivery
router.patch(
  "/orders/:orderId/delivery",
  protect,
  adminOnly,
  upload.single("file"),   // form field name must be "file"
  uploadDelivery
);

export default router;
