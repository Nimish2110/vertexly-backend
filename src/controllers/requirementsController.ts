import { Request, Response } from "express";
import Order from "../models/order.js";

export const submitRequirements = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;
    const { requirements } = req.body;

    console.log("REQ → orderId:", orderId);
    console.log("REQ.USER →", req.user);

    if (!requirements || requirements.trim() === "") {
      return res.status(400).json({ message: "Requirements cannot be empty" });
    }

    // ✅ FIX: Ensure order exists AND belongs to logged-in user
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user.id 
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found or not yours" });
    }

    // Update fields
    order.requirements = requirements;
    order.requirementsSubmitted = true;
    order.status = "requirements_submitted";

    await order.save();

    return res.json({
      message: "Requirements submitted successfully",
      order
    });

  } catch (error) {
    console.error("Requirements Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
