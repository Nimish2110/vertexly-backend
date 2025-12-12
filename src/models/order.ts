import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  template: mongoose.Types.ObjectId;
  templateName: string;
  price: number;
  customizationPrice: number;
  discount: number;
  total: number;
  status: string;
  requirements: string;
  requirementsSubmitted: boolean;

  // ⭐ NEW FIELDS
  deliveryFile: string | null;
  isDelivered: boolean;
  deliveredAt?: Date;
  deliverySubmitted: boolean;
  completionMessage: string;
  rejectionReason?: string;

}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: Schema.Types.ObjectId, ref: "Template", required: true },

    templateName: { type: String, required: true },

    price: { type: Number, required: true },
    customizationPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    requirements: { type: String, default: "" },
    requirementsSubmitted: { type: Boolean, default: false },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "requirements_submitted",
        "accepted",
        "rejected",
        "in_progress",
        "completed",
        "cancelled"
      ],
      default: "pending"
    },
    rejectionReason: { type: String, default: "" },

    // ⭐ NEW FIELDS IN SCHEMA
    deliveryFile: { type: String, default: null },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    completionMessage: { type: String, default: "" },
    deliverySubmitted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
