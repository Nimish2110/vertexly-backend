import { Request, Response } from "express";
import User, { IUser } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email AND include password
    const user = await User.findOne({ email }).select("+password") as IUser;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 3. Create JWT Token
    const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

    return res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

  } catch (error: any) {
  console.error("Login Error (ACTUAL):", error?.message, error);

  return res.status(500).json({
    message: "Server error",
    errorMessage: error?.message,
    stack: error?.stack
  });
}
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"  // default role
    });

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error("Register Error:", error?.message, error);

    return res.status(500).json({
      message: "Server error",
      errorMessage: error?.message,
      stack: error?.stack
    });
  }
};
