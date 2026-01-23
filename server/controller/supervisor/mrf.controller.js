import MrfRecord from "../../models/supervisor/mrfRecord.js";

export const createMrfRecord = async (req, res) => {
  try {
    const { supervisorName, cubeNumber } = req.body;
    const contactNumber = req.body.contactNumber || req.body.phoneNo;

    if (!supervisorName || !contactNumber || !cubeNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const record = await MrfRecord.create({
      supervisorName,
      contactNumber,
      cubeNumber: Number(cubeNumber),
      image: req.file.path,
      status: req.body.status || "Stored",
      dateSubmitted: req.body.dateSubmitted || new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "MRF record created successfully",
      data: record,
    });
  } catch (error) {
    console.log("CREATE MRF ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create MRF record",
      error: error.message,
    });
  }
};

export const getAllMrfRecords = async (req, res) => {
  try {
    const records = await MrfRecord.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch MRF records",
      error: error.message,
    });
  }
};
