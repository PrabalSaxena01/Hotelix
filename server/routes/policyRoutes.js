import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPolicies,
  getPolicyCategories,
  createPolicyCategory,
  updatePolicyCategory,
  deletePolicyCategory,
  createPolicy,
  updatePolicy,
  deletePolicy
} from "../controllers/policyController.js";

const policyRouter = express.Router();

// Public routes
policyRouter.get("/", getPolicies);
policyRouter.get("/categories", getPolicyCategories);

// Protected management routes
policyRouter.post("/category", protect, createPolicyCategory);
policyRouter.put("/category/:id", protect, updatePolicyCategory);
policyRouter.delete("/category/:id", protect, deletePolicyCategory);

policyRouter.post("/", protect, createPolicy);
policyRouter.put("/:id", protect, updatePolicy);
policyRouter.delete("/:id", protect, deletePolicy);

export default policyRouter;
