import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUtilities,
  getUtilityCategories,
  createUtilityCategory,
  deleteUtilityCategory,
  createAmenity,
  updateAmenity,
  toggleAmenityFeatured,
  deleteAmenity
} from "../controllers/utilityController.js";

const utilityRouter = express.Router();

// Public routes
utilityRouter.get("/", getUtilities);
utilityRouter.get("/categories", getUtilityCategories);

// Owner management routes
utilityRouter.post("/category", protect, createUtilityCategory);
utilityRouter.delete("/category/:id", protect, deleteUtilityCategory);

utilityRouter.post("/", protect, createAmenity);
utilityRouter.put("/:id", protect, updateAmenity);
utilityRouter.patch("/:id/toggle-featured", protect, toggleAmenityFeatured);
utilityRouter.delete("/:id", protect, deleteAmenity);

export default utilityRouter;
