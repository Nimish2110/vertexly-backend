import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";

/**
 * ⚠️ ENV VARIABLES (REQUIRED ON RENDER)
 * RAZORPAY_KEY_ID
 * RAZORPAY_KEY_SECRET
 */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

/**
 * 🔧 STEP 4 — Create Razorpay Order
 * POST /api/payments/create-order
 */
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.total * 100, // paise
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: {
        template: order.templateName,
        user: order.user.toString(),
      },
    });

    return res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs ONLY this
    });

  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

/**
 * 🔐 STEP 5 — Verify Payment
 * POST /api/payments/verify
 */
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ message: "Incomplete payment data" });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET as string
      )
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Payment verified → update order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "accepted";
    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};
