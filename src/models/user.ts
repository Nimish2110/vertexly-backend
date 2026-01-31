import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
  isDeleted: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows null values
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows null values
    },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
