import prisma from "../configs/prisma.js";

export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({ success: true, role, recentSearchedCities });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user;

        let cities = [...(user.recentSearchedCities || [])];
        if (cities.length < 3) {
            cities.push(recentSearchedCity);
        } else {
            cities.shift();
            cities.push(recentSearchedCity);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { recentSearchedCities: cities }
        });

        res.json({ success: true, message: "City Added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};