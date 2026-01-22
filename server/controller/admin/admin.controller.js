export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }
        if (username === "admin" && password === "admin@123") {
            return res.status(200).json({
                message: "Admin login successful"
            });
        } else {
            return res.status(401).json({
                message: "Invalid admin credentials"
            });
        }
    } catch (error) {
        return res.status(500).json({
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