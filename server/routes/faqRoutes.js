import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq
} from "../controllers/faqController.js";

const faqRouter = express.Router();

// Public routes
faqRouter.get("/", getFaqs);

// Owner management routes
faqRouter.post("/", protect, createFaq);
faqRouter.put("/:id", protect, updateFaq);
faqRouter.delete("/:id", protect, deleteFaq);

export default faqRouter;
