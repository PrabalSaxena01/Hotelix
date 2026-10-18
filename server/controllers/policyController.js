import prisma, { withLegacyId } from "../configs/prisma.js";

// Get all policy categories with their nested policies
export const getPolicies = async (req, res) => {
  try {
    const categories = await prisma.policyCategory.findMany({
      include: {
        policies: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { order: "asc" }
    });
    res.json({ success: true, categories: withLegacyId(categories) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get categories list
export const getPolicyCategories = async (req, res) => {
  try {
    const categories = await prisma.policyCategory.findMany({
      orderBy: { order: "asc" }
    });
    res.json({ success: true, categories: withLegacyId(categories) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a policy category
export const createPolicyCategory = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const category = await prisma.policyCategory.create({
      data: {
        name,
        description: description || null,
        icon: icon || "FileText",
        order: order ? parseInt(order) : 0
      }
    });

    res.json({ success: true, message: "Policy category created", category: withLegacyId(category) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a policy category
export const updatePolicyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, order } = req.body;

    const category = await prisma.policyCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(order !== undefined && { order: parseInt(order) })
      }
    });

    res.json({ success: true, message: "Policy category updated", category: withLegacyId(category) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a policy category
export const deletePolicyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.policyCategory.delete({ where: { id } });
    res.json({ success: true, message: "Policy category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a policy
export const createPolicy = async (req, res) => {
  try {
    const { title, content, importance, categoryId } = req.body;
    if (!title || !content || !categoryId) {
      return res.status(400).json({ success: false, message: "Title, content, and category are required" });
    }

    const policy = await prisma.policy.create({
      data: {
        title,
        content,
        importance: importance || "standard",
        categoryId
      }
    });

    res.json({ success: true, message: "Policy created successfully", policy: withLegacyId(policy) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a policy
export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, importance, categoryId } = req.body;

    const policy = await prisma.policy.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(importance && { importance }),
        ...(categoryId && { categoryId })
      }
    });

    res.json({ success: true, message: "Policy updated successfully", policy: withLegacyId(policy) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a policy
export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.policy.delete({ where: { id } });
    res.json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
