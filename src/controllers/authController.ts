import { Request, Response } from "express";
import User, { IUser } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ===========================
   LOGIN USER (Email OR Phone)
=========================== */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    }).select("+password") as IUser;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phone: user.phone || null,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error("Login Error:", error?.message, error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   REGISTER USER (Email OR Phone)
=========================== */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({
        message: "Name, password and email or phone are required"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or phone"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email || null,
        phone: newUser.phone || null,
        role: newUser.role
      }
    });

  } catch (error: any) {
    console.error("Register Error:", error?.message, error);
    return res.status(500).json({ message: "Server error" });
  }
};
