import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAddOns,
  createAddOn,
  updateAddOn,
  toggleAddOnAvailability,
  deleteAddOn
} from "../controllers/addonController.js";

const addonRouter = express.Router();

// Public routes
addonRouter.get("/", getAddOns);

// Owner management routes
addonRouter.post("/", protect, createAddOn);
addonRouter.put("/:id", protect, updateAddOn);
addonRouter.patch("/:id/toggle", protect, toggleAddOnAvailability);
addonRouter.delete("/:id", protect, deleteAddOn);

export default addonRouter;
