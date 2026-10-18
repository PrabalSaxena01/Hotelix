import prisma, { withLegacyId } from "../configs/prisma.js";

// Guest submits an inquiry from Contact Us page
export const createInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "pending"
      }
    });

    res.json({
      success: true,
      message: "Your inquiry has been submitted! Our concierge team will contact you shortly.",
      inquiry: withLegacyId(inquiry)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Hotel owner retrieves all inquiries
export const getInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, inquiries: withLegacyId(inquiries) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update inquiry status (pending -> replied -> resolved)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "replied", "resolved", "archived"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, message: `Inquiry status updated to ${status}`, inquiry: withLegacyId(inquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inquiry.delete({ where: { id } });
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
