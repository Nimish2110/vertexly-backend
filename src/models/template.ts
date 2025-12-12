import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  slug: string;
  image: string;
  price: number;
  category?: string;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ITemplate>("Template", TemplateSchema);
