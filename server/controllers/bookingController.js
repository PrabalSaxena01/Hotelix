import transporter from '../configs/nodemailer.js';
import prisma, { withLegacyId } from '../configs/prisma.js';
import stripe from 'stripe';

// Function to check room availability
export const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        if (!room || !checkInDate || !checkOutDate) return false;

        const count = await prisma.booking.count({
            where: {
                roomId: room,
                status: { not: 'cancelled' },
                checkInDate: { lte: new Date(checkOutDate) },
                checkOutDate: { gte: new Date(checkInDate) }
            }
        });
        return count === 0;
    } catch (error) {
        console.error("Availability check error:", error.message);
        return true;
    }
};

// API to check room availability (POST /api/bookings/check-availability)
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to create a new booking (POST /api/bookings/book)
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests, paymentMethod } = req.body;
        const userId = req.user.id || req.user._id;

        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" });
        }

        // Get room details with hotel
        const roomData = await prisma.room.findUnique({
            where: { id: room },
            include: { hotel: true }
        });

        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }

        // Calculate total price based on number of nights
        let totalPrice = roomData.pricePerNight;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        totalPrice *= nights;

        // Create booking in PostgreSQL via Prisma
        const booking = await prisma.booking.create({
            data: {
                userId,
                roomId: roomData.id,
                hotelId: roomData.hotelId,
                guests: +guests || 1,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice,
                paymentMethod: paymentMethod || "Pay at hotel",
                status: "pending",
                isPaid: false
            }
        });

        // Email confirmation if configured
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
                    to: req.user.email,
                    subject: "Booking Confirmation",
                    html: `
                        <h2>Here are your booking details</h2>
                        <p>Dear ${req.user.username || 'Valued Guest'},</p>
                        <p>Thank you for booking with us! Here are your booking details:</p>
                        <ul>
                            <li><strong>Booking ID: </strong> ${booking.id}</li>
                            <li><strong>Hotel Name: </strong> ${roomData.hotel?.name || 'Hotelix Hotel'}</li>
                            <li><strong>Check-in: </strong> ${new Date(booking.checkInDate).toDateString()}</li>
                            <li><strong>Check-out: </strong> ${new Date(booking.checkOutDate).toDateString()}</li>
                            <li><strong>Guests: </strong> ${booking.guests}</li>
                            <li><strong>Total Price: </strong> $ ${booking.totalPrice}</li>
                        </ul>
                        <p>We look forward to welcoming you!</p>
                        <p>If you need to cancel or modify your booking, reply to this email.</p>
                    `
                };
                await transporter.sendMail(mailOptions);
            } catch (mailError) {
                console.warn("Mail confirmation skipped:", mailError.message);
            }
        }

        res.json({
            success: true,
            message: "Booking created successfully",
            booking: withLegacyId(booking)
        });
    } catch (error) {
        console.error("createBooking error:", error);
        res.json({ success: false, message: error.message || "Failed to create booking" });
    }
};

// API to get all bookings for a user (GET /api/bookings/user)
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                room: true,
                hotel: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ success: true, bookings: withLegacyId(bookings) });
    } catch (error) {
        console.error("getUserBookings error:", error);
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
};

// Function to fetch bookings data for hotel owner dashboard (GET /api/bookings/hotel)
export const getHotelBookings = async (req, res) => {
    try {
        const userId = (req.auth && req.auth().userId) || (req.user && (req.user.id || req.user._id));

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const hotel = await prisma.hotel.findFirst({
            where: { ownerId: userId }
        });

        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        const bookings = await prisma.booking.findMany({
            where: { hotelId: hotel.id },
            include: {
                room: true,
                hotel: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Total Bookings
        const totalBookings = bookings.length;

        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({
            success: true,
            dashboardData: {
                totalBookings,
                totalRevenue,
                bookings: withLegacyId(bookings)
            }
        });
    } catch (error) {
        console.error("getHotelBookings error:", error);
        res.json({ success: false, message: "Failed to fetch hotel bookings" });
    }
};

// API to initiate Stripe payment checkout session (POST /api/bookings/stripe-payment)
export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.json({ success: false, message: "Booking ID is required" });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                room: {
                    include: { hotel: true }
                }
            }
        });

        if (!booking || !booking.room) {
            return res.json({ success: false, message: "Booking not found" });
        }

        const totalPrice = booking.totalPrice;
        const origin = req.headers.origin || "http://localhost:5173";

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.json({ success: false, message: "Stripe key is not configured" });
        }

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: booking.room.hotel?.name || "Hotel Booking",
                        description: `Booking for ${booking.room.roomType}`,
                    },
                    unit_amount: Math.round(totalPrice * 100), // Convert to cents
                },
                quantity: 1,
            }
        ];

        // Create Stripe checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: {
                bookingId,
            }
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("stripePayment error:", error);
        res.json({ success: false, message: "Payment Failed!" });
    }
};