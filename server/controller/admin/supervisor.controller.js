// @ts-nocheck
import jwt from "jsonwebtoken";
import Supervisor from "../../models/admin/supervisor.model.js";

/**
 * ADMIN → CREATE SUPERVISOR
 * POST /api/supervisors
 */
export const createSupervisor = async (req, res) => {
  try {
    console.log("Creating supervisor with data:", req.body);

    const {
      supervisorName,
      username,
      email,
      phoneNumber,
      password,
      status,
    } = req.body;

    // 🔒 HARD VALIDATION (prevents 500)
    if (
      !supervisorName ||
      !username ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (phoneNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }

    const supervisor = new Supervisor({
      supervisorName: supervisorName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      password,
      status: status || "active",
    });

    await supervisor.save();

    res.status(201).json({
      success: true,
      message: "Supervisor created successfully",
      data: supervisor,
    });
  } catch (error) {
    console.error("Error creating supervisor:", error);

    // 🔁 DUPLICATE KEY ERROR
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // 🔁 MONGOOSE VALIDATION ERROR
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create supervisor",
    });
  }
};


/**
 * ADMIN → GET ALL SUPERVISORS
 * GET /api/supervisors
 */
export const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find().select("-password");

    res.status(200).json({
      success: true,
      count: supervisors.length,
      data: supervisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch supervisors",
      error: error.message,
    });
  }
};

/**
 * SUPERVISOR LOGIN
 * POST /api/supervisors/login
 */
export const supervisorLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const supervisor = await Supervisor.findOne({ username });

    if (!supervisor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (supervisor.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Supervisor account is inactive",
      });
    }

    const isMatch = await supervisor.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: supervisor._id, 
        role: "supervisor", 
        username: supervisor.username 
      },
      process.env.SECRET_KEY || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Set token in cookie
    res.cookie("jwt-NAC-BUGUDA", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict"
    });

    res.status(200).json({
      success: true,
      message: "Supervisor Login successful",
      token,
      data: {
        id: supervisor._id,
        supervisorName: supervisor.supervisorName,
        username: supervisor.username,
        email: supervisor.email,
        role: "supervisor"
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
