import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { 
  getAllTemplatesAdmin, 
  createTemplateAdmin, 
  updateTemplateAdmin,
  deleteTemplateAdmin
} from "../controllers/adminTemplateController.js";


const router = Router();

// GET /api/admin/templates → list all templates
router.get("/", protect, adminOnly, getAllTemplatesAdmin);
router.post("/", protect, adminOnly, createTemplateAdmin);
router.patch("/:templateId", protect, adminOnly, updateTemplateAdmin);
router.delete("/:templateId", protect, adminOnly, deleteTemplateAdmin);

export default router;
