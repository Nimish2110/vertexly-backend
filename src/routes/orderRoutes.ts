import { Router } from "express";
import Order from "../models/order.js";
import Template from "../models/template.js";
import { protect, AuthRequest } from "../middleware/authMiddleware.js";
import { submitRequirements } from "../controllers/requirementsController.js";
import { getMyOrders, getSingleOrder, downloadDelivery } from "../controllers/orderController.js";

const router = Router();

/* ============================================================
   CREATE ORDER
   ------------------------------------------------------------
   Backend now returns ONLY the order object.
   Frontend expects: res.data._id
============================================================ */
router.post("/create", protect, async (req: AuthRequest, res) => {
  try {
    const { templateId, customizationPrice = 0, discount = 0 } = req.body;

    // Find the template by slug
    const template = await Template.findOne({ slug: templateId });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Calculate total
    const total = template.price + customizationPrice - discount;

    // Create order (store template._id, not slug)
    const order = await Order.create({
      user: req.user!.id,
      template: template._id,
      templateName: template.name,
      price: template.price,
      customizationPrice,
      discount,
      total,
      requirements: "",
      requirementsSubmitted: false,
      status: "pending"
    });

    return res.status(201).json(order); // <-- IMPORTANT FIX

  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================
   ROUTE ORDER **IMPORTANT**
   PUT /:orderId/requirements MUST come BEFORE /:orderId
============================================================ */

// Submit requirements (PUT, NOT POST)
router.put("/:orderId/requirements", protect, submitRequirements);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get single order
router.get("/:orderId", protect, getSingleOrder);

// Download delivery file
router.get("/:orderId/download", protect, downloadDelivery);

export default router;
