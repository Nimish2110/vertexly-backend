import { Router } from "express";
import Template from "../models/template.js";

const router = Router();

// 👉 TEMP: Add a template (use Postman one time)
router.post("/", async (req, res) => {
  try {
    const { name, image, price, category } = req.body;

    const template = await Template.create({
      name,
      image,
      price,
      category
    });

    res.status(201).json(template);
  } catch (error) {
    console.error("Add Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 GET all templates
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    console.error("Fetch Templates Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 GET one template by ID
router.get("/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    console.error("Fetch Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
