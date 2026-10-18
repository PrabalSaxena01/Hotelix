import { v2 as cloudinary } from 'cloudinary';
import prisma, { withLegacyId } from "../configs/prisma.js";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const ownerId = req.user?.id || req.user?._id || req.auth?.().userId;

        const hotel = await prisma.hotel.findFirst({
            where: { ownerId }
        });

        if (!hotel) {
            return res.json({ success: false, message: "No hotel found" });
        }

        // Upload images to cloudinary
        const uploadImages = (req.files || []).map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        const images = await Promise.all(uploadImages);

        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch (e) {
                parsedAmenities = [amenities];
            }
        }

        const room = await prisma.room.create({
            data: {
                hotelId: hotel.id,
                roomType,
                pricePerNight: +pricePerNight,
                amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [],
                images
            }
        });

        res.json({ success: true, message: "Room created successfully", room: withLegacyId(room) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            where: { isAvailable: true },
            include: {
                hotel: {
                    include: {
                        owner: {
                            select: { image: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, rooms: withLegacyId(rooms) });
    } catch (error) {
        // Fallback for unconfigured database in local development
        console.warn("Could not query rooms from PostgreSQL:", error.message);
        res.json({ success: true, rooms: [] });
    }
};

// API to get all rooms of a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const ownerId = req.user?.id || req.user?._id || req.auth?.().userId;
        const hotelData = await prisma.hotel.findFirst({
            where: { ownerId }
        });

        if (!hotelData) {
            return res.json({ success: true, rooms: [] });
        }

        const rooms = await prisma.room.findMany({
            where: { hotelId: hotelData.id },
            include: { hotel: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, rooms: withLegacyId(rooms) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }

        const updated = await prisma.room.update({
            where: { id: roomId },
            data: { isAvailable: !roomData.isAvailable }
        });

        res.json({ success: true, message: "Room Availability updated", room: withLegacyId(updated) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};