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
    console.error("Create complaint error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
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




/**
 * Admin updates complaint status
 */
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatus = ["Pending", "In Progress", "Resolved"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};