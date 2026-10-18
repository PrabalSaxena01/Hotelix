import prisma, { withLegacyId } from "../configs/prisma.js";

// Middleware to check user authentication
export const protect = async (req, res, next) => {
    try {
        if (!req.auth) {
            return res.json({ success: false, message: "not authenticated" });
        }
        const { userId } = req.auth();
        if (!userId) {
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