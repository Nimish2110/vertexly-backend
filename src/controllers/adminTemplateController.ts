import { Request, Response } from "express";
import Template from "../models/template.js";

export const getAllTemplatesAdmin = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    console.error("Admin Get Templates Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTemplateAdmin = async (req: Request, res: Response) => {
  try {
    const { name, image, price, category } = req.body;

    if (!name || !image || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTemplate = await Template.create({
      name,
      image,
      price,
      category
    });

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template: newTemplate
    });
  } catch (error) {
    console.error("Admin Create Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTemplateAdmin = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const { name, image, price, category } = req.body;

    // Find template
    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Update only provided fields
    if (name) template.name = name;
    if (image) template.image = image;
    if (price) template.price = price;
    if (category) template.category = category;

    await template.save();

    res.json({
      success: true,
      message: "Template updated successfully",
      template,
    });

  } catch (error) {
    console.error("Admin Update Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteTemplateAdmin = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;

    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    await template.deleteOne();

    res.json({
      success: true,
      message: "Template deleted successfully"
    });

  } catch (error) {
    console.error("Admin Delete Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
