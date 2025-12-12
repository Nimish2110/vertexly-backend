import { Request, Response } from "express";
import Order from "../models/order.js";

export const uploadDelivery = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // multer attaches file to req.file
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Save file metadata (adjust field name to your schema)
    // I used deliveryFile and deliverySubmitted as you described
    (order as any).deliveryFile = file.filename ?? file.path;
    (order as any).deliverySubmitted = true;
    order.status = "completed"; // mark order completed (or whichever status you want)
    await order.save();

    return res.json({
      message: "Delivery uploaded and attached to order",
      order
    });
  } catch (error) {
    console.error("Admin Delivery Upload Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export default uploadDelivery;
