import MccRecord from "../../models/supervisor/mccRecord.js";

export const createMccRecord = async (req, res) => {
  try {
    const { supervisorName, contactNumber, cubeNumber } = req.body;

    const record = await MccRecord.create({
      supervisorName,
      contactNumber,
      cubeNumber,
      image: req.file?.path,
    });

    res.status(201).json({
      success: true,
      message: "MCC record created successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create MCC record",
      error: error.message,
    });
  }
};

export const getAllMccRecords = async (req, res) => {
  try {
    const records = await MccRecord.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch MCC records",
      error: error.message,
    });
  }
};
