import prisma, { withLegacyId } from "../configs/prisma.js";

// Get all utility / amenity categories with their items
export const getUtilities = async (req, res) => {
  try {
    const categories = await prisma.amenityCategory.findMany({
      include: {
        amenities: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { name: "asc" }
    });

    // Also get uncategorized amenities if any exist
    const uncategorized = await prisma.amenity.findMany({
      where: { categoryId: null }
    });

    res.json({
      success: true,
      categories: withLegacyId(categories),
      uncategorized: withLegacyId(uncategorized)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get utility categories list
export const getUtilityCategories = async (req, res) => {
  try {
    const categories = await prisma.amenityCategory.findMany({
      orderBy: { name: "asc" }
    });
    res.json({ success: true, categories: withLegacyId(categories) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create utility category
export const createUtilityCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const category = await prisma.amenityCategory.create({
      data: {
        name,
        icon: icon || "Sparkles"
      }
    });

    res.json({ success: true, message: "Category created successfully", category: withLegacyId(category) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete utility category
export const deleteUtilityCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.amenityCategory.delete({ where: { id } });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create an amenity / utility
export const createAmenity = async (req, res) => {
  try {
    const { name, description, icon, isFeatured, categoryId } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Amenity name is required" });
    }

    const amenity = await prisma.amenity.create({
      data: {
        name,
        description: description || null,
        icon: icon || "CheckCircle",
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        categoryId: categoryId || null
      }
    });

    res.json({ success: true, message: "Amenity added successfully", amenity: withLegacyId(amenity) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an amenity / utility
export const updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isFeatured, categoryId } = req.body;

    const amenity = await prisma.amenity.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(categoryId !== undefined && { categoryId: categoryId || null })
      }
    });

    res.json({ success: true, message: "Amenity updated successfully", amenity: withLegacyId(amenity) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle amenity featured status
export const toggleAmenityFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.amenity.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Amenity not found" });
    }

    const updated = await prisma.amenity.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured }
    });

    res.json({
      success: true,
      message: `Amenity is now ${updated.isFeatured ? 'featured' : 'standard'}`,
      amenity: withLegacyId(updated)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an amenity
export const deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.amenity.delete({ where: { id } });
    res.json({ success: true, message: "Amenity deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
