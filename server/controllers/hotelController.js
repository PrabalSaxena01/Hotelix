import prisma, { withLegacyId } from "../configs/prisma.js";

export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const ownerId = req.user.id || req.user._id;

        // Check if user already has a registered hotel
        const existingHotel = await prisma.hotel.findFirst({
            where: { ownerId }
        });

        if (existingHotel) {
            return res.json({ success: false, message: "Hotel Already Registered!" });
        }

        const hotel = await prisma.hotel.create({
            data: {
                name,
                address,
                contact,
                city,
                ownerId
            }
        });

        await prisma.user.update({
            where: { id: ownerId },
            data: { role: "hotelOwner" }
        });

        res.json({ success: true, message: "Hotel registered successfully!", hotel: withLegacyId(hotel) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};