import prisma, { withLegacyId } from "../configs/prisma.js";

// Get all FAQs (guests)
export const getFaqs = async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "asc" }]
    });

    res.json({ success: true, faqs: withLegacyId(faqs) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Question and answer are required" });
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        category: category || "General",
        order: order ? parseInt(order) : 0
      }
    });

    res.json({ success: true, message: "FAQ created successfully", faq: withLegacyId(faq) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, order } = req.body;

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        ...(question && { question }),
        ...(answer && { answer }),
        ...(category && { category }),
        ...(order !== undefined && { order: parseInt(order) })
      }
    });

    res.json({ success: true, message: "FAQ updated successfully", faq: withLegacyId(faq) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.faq.delete({ where: { id } });
    res.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
