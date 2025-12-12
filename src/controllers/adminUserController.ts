import { Request, Response } from "express";
import User from "../models/user.js";
import Order from "../models/order.js";

export const getAllUsersAdmin = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleUserAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all orders for this user
    const orders = await Order.find({ user: userId })
      .populate("template", "name price")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      user,
      orders,
    });

  } catch (error) {
    console.error("Admin Get Single User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Validate role
    if (role) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role value" });
      }
      user.role = role;
    }

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    console.error("Admin Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete
    user.isDeleted = true;
    await user.save();

    res.json({
      success: true,
      message: "User deleted (soft delete) successfully"
    });

  } catch (error) {
    console.error("Admin Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Restore a soft-deleted user
export const restoreUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isDeleted) {
      return res.json({ success: true, message: "User is already active" });
    }

    user.isDeleted = false;
    await user.save();

    res.json({
      success: true,
      message: "User restored successfully",
      user
    });

  } catch (error) {
    console.error("Restore user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
