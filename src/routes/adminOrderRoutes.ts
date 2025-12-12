import { Router } from "express";
import Order from "../models/order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { updateOrderStatus } from "../controllers/adminOrderController.js";
import { startOrder } from "../controllers/adminOrderController.js";
import { completeOrder } from "../controllers/adminOrderController.js";
import { cancelOrder } from "../controllers/adminOrderController.js";
import { rejectOrder } from "../controllers/adminOrderController.js";


const router = Router();

// GET /api/admin/orders - list all orders
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("template", "name price");

    res.json(orders);
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:orderId/status", protect, adminOnly, updateOrderStatus);


// PATCH /api/admin/orders/:orderId/accept
router.patch("/orders/:orderId/accept", protect, adminOnly, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "accepted";
    await order.save();

    res.json({ message: "Order accepted", order });
  } catch (error) {
    console.error("Admin Accept Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/admin/orders/:orderId/reject
router.patch("/orders/:orderId/reject", protect, adminOnly, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "rejected";
    await order.save();

    res.json({ message: "Order rejected", order });
  } catch (error) {
    console.error("Admin Reject Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:orderId/start", protect, adminOnly, startOrder);
router.patch("/:orderId/complete", protect, adminOnly, completeOrder);
router.patch("/:orderId/cancel", protect, adminOnly, cancelOrder);
// Reject order with reason
router.patch("/:orderId/reject", protect, adminOnly, rejectOrder);

export default router;
