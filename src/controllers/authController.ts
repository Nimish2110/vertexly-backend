import { Request, Response } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * LOGIN (Email OR Phone)
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    // 🔥 Accept ALL possible frontend keys
    const identifier =
      req.body.identifier ||
      req.body.email ||
      req.body.phone ||
      req.body.emailOrPhone ||
      req.body.username ||
      req.body.value;

    const password: string | undefined = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const isEmail =
      typeof identifier === "string" && identifier.includes("@");

    const user = await User.findOne(
      isEmail ? { email: identifier } : { phone: identifier }
    ).select("+password");

    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * REGISTER (Email OR Phone)
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const orConditions: Array<{ email?: string; phone?: string }> = [];
    if (email) orConditions.push({ email });
    if (phone) orConditions.push({ phone });

    const existingUser = await User.findOne({ $or: orConditions });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
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
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
