import prisma, { withLegacyId } from "../configs/prisma.js";

// Middleware to check user authentication
export const protect = async (req, res, next) => {
    try {
        if (!req.auth) {
            return res.json({ success: false, message: "not authenticated" });
        }
        const { userId } = req.auth();
        if (!userId) {
            // Local dev mode fallback when Clerk keys are not configured
            if (!process.env.CLERK_SECRET_KEY) {
                let devUser = await prisma.user.findFirst({ where: { role: "hotelOwner" } });
                if (!devUser) {
                    devUser = await prisma.user.findFirst();
                }
                if (!devUser) {
                    // Create a local dev owner if none exists
                    devUser = await prisma.user.create({
                        data: {
                            id: "dev_owner_001",
                            username: "demo_owner",
                            email: "manager@hotelix.com",
                            role: "hotelOwner"
                        }
                    });
                }
                req.user = withLegacyId(devUser);
                return next();
            }
            return res.json({ success: false, message: "not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = withLegacyId(user);
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};