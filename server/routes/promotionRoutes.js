import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getActivePromotions,
  getAllPromotions,
  validatePromotion,
  createPromotion,
  updatePromotion,
  togglePromotion,
  deletePromotion
} from "../controllers/promotionController.js";

const promotionRouter = express.Router();

// Public routes
promotionRouter.get("/", getActivePromotions);
promotionRouter.post("/validate", validatePromotion);

// Owner management routes
promotionRouter.get("/all", protect, getAllPromotions);
promotionRouter.post("/", protect, createPromotion);
promotionRouter.put("/:id", protect, updatePromotion);
promotionRouter.patch("/:id/toggle", protect, togglePromotion);
promotionRouter.delete("/:id", protect, deletePromotion);

export default promotionRouter;
