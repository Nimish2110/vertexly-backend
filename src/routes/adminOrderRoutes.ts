import { Router } from "express";
import Order from "../models/order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  updateOrderStatus,
  startOrder,
  completeOrder,
  cancelOrder,
  rejectOrder,
  acceptOrder
} from "../controllers/adminOrderController.js";

const router = Router();

/**
 * GET /api/admin/orders
 * Optional query: ?status=
 */
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("template", "name price");

    res.json(orders);
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: Accept order (unlock payment)
 */
router.patch(
  "/orders/:orderId/accept",
  protect,
  adminOnly,
  acceptOrder
);

/**
 * ADMIN: Generic status update (use carefully)
 */
router.patch(
  "/orders/:orderId/status",
  protect,
  adminOnly,
  updateOrderStatus
);

/**
 * ADMIN: Start work
 */
router.patch(
  "/orders/:orderId/start",
  protect,
  adminOnly,
  startOrder
);

/**
 * ADMIN: Mark completed
 */
router.patch(
  "/orders/:orderId/complete",
  protect,
  adminOnly,
  completeOrder
);

/**
 * ADMIN: Cancel order
 */
router.patch(
  "/orders/:orderId/cancel",
  protect,
  adminOnly,
  cancelOrder
);

/**
 * ADMIN: Reject order with reason
 */
router.patch(
  "/orders/:orderId/reject",
  protect,
  adminOnly,
  rejectOrder
);

export default router;
