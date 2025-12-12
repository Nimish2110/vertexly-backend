import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import Order from "../models/order.js"; // ✅ FIXED IMPORT

// USER: Get all their own orders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // prevent TS error

    const orders = await Order.find({ user: userId })
      .populate("template", "name price")
      .sort({ createdAt: -1 });

    return res.json(orders);  // ✅ MUST return array only

  } catch (error) {
    console.error("Get My Orders Error:", error);
    return res.status(500).json([]);
  }
};

// USER: Get details of a single order
export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!.id;

    // Find order that belongs to this user
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("template", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      message: "Order fetched successfully",
      order
    });

  } catch (error) {
    console.error("Get Single Order Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const downloadDelivery = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Find order belonging to logged-in user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user!.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.deliveryFile) {
      return res.status(400).json({ message: "No delivery file available" });
    }

    const filePath = path.join(process.cwd(), "uploads", order.deliveryFile);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Delivery file missing on server" });
    }

    // stream/download the file
    return res.download(filePath, order.deliveryFile);

  } catch (error) {
    console.error("Download Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};