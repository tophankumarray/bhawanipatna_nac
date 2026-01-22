import MrfRecord from "../../models/supervisor/mccRecord.js";

export const createMrfRecord = async (req, res) => {
  try {
    const { supervisorName, contactNumber, cubeNumber } = req.body;

    const record = await MrfRecord.create({
      supervisorName,
      contactNumber,
      cubeNumber,
      image: req.file?.path,
    });

    res.status(201).json({
      success: true,
      message: "MRF record created successfully",
      data: record,
    });
  } catch (error) {
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
