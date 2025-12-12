import { Request, Response } from "express";
import Order from "../models/order.js";

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "pending",
  "requirements_submitted",
  "accepted",
  "rejected",
  "in_progress",
  "completed",
  "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        allowed: allowedStatuses
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.json({
      message: "Order status updated",
      order
    });

  } catch (error) {
    console.error("Admin Update Status Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Start project work
export const startOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "in_progress";
    await order.save();

    res.json({
      message: "Order moved to IN PROGRESS",
      order
    });

  } catch (error) {
    console.error("Start Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Mark order as COMPLETED
export const completeOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "completed";
    await order.save();

    res.json({
      message: "Order marked as COMPLETED",
      order
    });

  } catch (error) {
    console.error("Complete Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Cancel an order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order has been CANCELLED",
      order
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deliverProject = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Delivery file is required" });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Save file to DB
    order.deliveryFile = req.file.path;
    order.deliverySubmitted = true;
    order.status = "completed";

    await order.save();

    res.json({
      message: "Project delivered successfully",
      order
    });

  } catch (error) {
    console.error("Deliver Project Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Reject an order with a reason
export const rejectOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "rejected";
    order.rejectionReason = reason;

    await order.save();

    return res.json({
      message: "Order rejected successfully",
      order
    });

  } catch (error) {
    console.error("Reject Order Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};