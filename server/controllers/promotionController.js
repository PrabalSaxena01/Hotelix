import prisma, { withLegacyId } from "../configs/prisma.js";

// Get active promotions for guest browsing
export const getActivePromotions = async (req, res) => {
  try {
    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        validTo: { gte: now }
      },
      orderBy: { validTo: "asc" }
    });
    res.json({ success: true, promotions: withLegacyId(promotions) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all promotions for owner dashboard
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, promotions: withLegacyId(promotions) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate promo code during checkout
export const validatePromotion = async (req, res) => {
  try {
    const { code, nights = 1, totalAmount = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Promotion code is required" });
    }

    const promo = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!promo) {
      return res.json({ success: false, message: "Invalid promo code" });
    }

    if (!promo.isActive) {
      return res.json({ success: false, message: "This promo code is no longer active" });
    }

    const now = new Date();
    if (new Date(promo.validTo) < now) {
      return res.json({ success: false, message: "This promo code has expired" });
    }

    if (new Date(promo.validFrom) > now) {
      return res.json({ success: false, message: "This promo code is not valid yet" });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.json({ success: false, message: "This promotion has reached its maximum usage limit" });
    }

    if (nights < promo.minNights) {
      return res.json({
        success: false,
        message: `This promo requires a minimum stay of ${promo.minNights} night${promo.minNights > 1 ? 's' : ''}`
      });
    }

    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = (totalAmount * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }

    // Ensure discount does not exceed total amount
    discount = Math.min(discount, totalAmount);
    const finalAmount = Math.max(0, totalAmount - discount);

    res.json({
      success: true,
      message: `Promo code '${promo.code}' applied successfully!`,
      promotion: withLegacyId(promo),
      discount: Math.round(discount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a promotion
export const createPromotion = async (req, res) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      validFrom,
      validTo,
      minNights,
      maxUses,
      bannerImage,
      isActive
    } = req.body;

    if (!code || !title || !discountValue || !validTo) {
      return res.status(400).json({ success: false, message: "Code, title, discount value, and valid until date are required" });
    }

    const cleanCode = code.toUpperCase().trim();
    const existing = await prisma.promotion.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return res.status(400).json({ success: false, message: "A promotion with this code already exists" });
    }

    const promo = await prisma.promotion.create({
      data: {
        code: cleanCode,
        title,
        description: description || "",
        discountType: discountType || "percentage",
        discountValue: parseFloat(discountValue),
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validTo: new Date(validTo),
        minNights: minNights ? parseInt(minNights) : 1,
        maxUses: maxUses ? parseInt(maxUses) : null,
        bannerImage: bannerImage || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    res.json({ success: true, message: "Promotion created successfully", promotion: withLegacyId(promo) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a promotion
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      validFrom,
      validTo,
      minNights,
      maxUses,
      bannerImage,
      isActive
    } = req.body;

    const promo = await prisma.promotion.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase().trim() }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(validFrom && { validFrom: new Date(validFrom) }),
        ...(validTo && { validTo: new Date(validTo) }),
        ...(minNights !== undefined && { minNights: parseInt(minNights) }),
        ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
        ...(bannerImage !== undefined && { bannerImage }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      }
    });

    res.json({ success: true, message: "Promotion updated successfully", promotion: withLegacyId(promo) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle promotion active state
export const togglePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.promotion.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    const updated = await prisma.promotion.update({
      where: { id },
      data: { isActive: !existing.isActive }
    });

    res.json({
      success: true,
      message: `Promotion is now ${updated.isActive ? 'active' : 'inactive'}`,
      promotion: withLegacyId(updated)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a promotion
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promotion.delete({ where: { id } });
    res.json({ success: true, message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
