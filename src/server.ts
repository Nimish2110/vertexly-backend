import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import requirementsRoutes from "./routes/requirementsRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminTemplateRoutes from "./routes/adminTemplateRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminDeliveryRoutes from "./routes/adminDeliveryRoutes.js";


dotenv.config();
connectDB(); 

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vertexly-showcase.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders", requirementsRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/templates", adminTemplateRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminDeliveryRoutes);
app.use("/uploads", express.static("uploads"));


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Vertexly Backend is running 🚀" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
