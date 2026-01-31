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

    // Email is optional now (because phone login exists)
    email: { type: String, unique: true, sparse: true },

    // Phone is optional but unique
    phone: { type: String, unique: true, sparse: true },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
