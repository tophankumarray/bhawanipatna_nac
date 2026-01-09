import Complaint from "../../models/citizen/complaint.model.js";
/**
 * Create a new complaint
 */
export const createComplaint = async (req, res) => {
  try {
    const { description, fullName, phoneNumber, wardNumber, area, category } =
      req.body;

    const image = req.file ? req.file.path : null;

    const complaint = await Complaint.create({
      fullName,
      phoneNumber,
      wardNumber,
      area,
      category,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint",
      error: error.message,
    });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
