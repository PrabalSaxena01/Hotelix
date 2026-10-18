import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

// Public contact submission
inquiryRouter.post("/", createInquiry);

// Owner inquiry management
inquiryRouter.get("/", protect, getInquiries);
inquiryRouter.patch("/:id/status", protect, updateInquiryStatus);
inquiryRouter.delete("/:id", protect, deleteInquiry);

export default inquiryRouter;
