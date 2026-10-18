import prisma, { withLegacyId } from "../configs/prisma.js";

// Get all add-ons (guests can filter by category or availability)
export const getAddOns = async (req, res) => {
  try {
    const { category, availableOnly } = req.query;
    const where = {};

    if (category) {
      where.category = category;
    }
    if (availableOnly === "true") {
      where.isAvailable = true;
    }

    const addons = await prisma.addOn.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, addons: withLegacyId(addons) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create an add-on
export const createAddOn = async (req, res) => {
  try {
    const { name, description, price, priceType, category, image, isAvailable } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    const addon = await prisma.addOn.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        priceType: priceType || "per_stay",
        category: category || "general",
        image: image || null,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
      }
    });

    res.json({ success: true, message: "Add-on created successfully", addon: withLegacyId(addon) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an add-on
export const updateAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, priceType, category, image, isAvailable } = req.body;

    const addon = await prisma.addOn.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(priceType && { priceType }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) })
      }
    });

    res.json({ success: true, message: "Add-on updated successfully", addon: withLegacyId(addon) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle add-on availability
export const toggleAddOnAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.addOn.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Add-on not found" });
    }

    const updated = await prisma.addOn.update({
      where: { id },
      data: { isAvailable: !existing.isAvailable }
    });

    res.json({ success: true, message: `Add-on is now ${updated.isAvailable ? 'available' : 'unavailable'}`, addon: withLegacyId(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an add-on
export const deleteAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.addOn.delete({ where: { id } });
    res.json({ success: true, message: "Add-on deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
