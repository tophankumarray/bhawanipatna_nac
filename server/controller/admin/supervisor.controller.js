import Supervisor from "../../models/admin/supervisor.model.js";

/**
 * ADMIN → CREATE SUPERVISOR
 * POST /api/supervisors
 */
export const createSupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Supervisor created successfully",
      data: supervisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create supervisor",
      error: error.message,
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

    res.status(200).json({
      success: true,
      message: "Supervisor Login successful",
      data: {
        id: supervisor._id,
        supervisorName: supervisor.supervisorName,
        username: supervisor.username,
        email: supervisor.email,
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
