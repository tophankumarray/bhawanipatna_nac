// @ts-nocheck
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }
        if (username === "admin" && password === "admin@123") {
            // Generate JWT token
            const token = jwt.sign(
                { userId: "admin", role: "admin", username },
                process.env.SECRET_KEY || "your-secret-key",
                { expiresIn: "7d" }
            );

            // Set token in cookie
            res.cookie("jwt-NAC-BUGUDA", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: "strict"
            });

            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token,
                data: {
                    username,
                    role: "admin"
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const adminLogout = async (req, res) => {
    try {
        console.log("req-->",req)
        res.clearCookie("jwt-NAC-BUGUDA")
        console.log("Logout control called !!")
        return res.status(200).json({
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.error("Error in adminLogout:", error);
        return res.status(500).json({ message: "Server error during logout." });
    }
};