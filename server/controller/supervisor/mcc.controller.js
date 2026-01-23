import MccRecord from "../../models/supervisor/mccRecord.js";

export const createMccRecord = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

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

    const record = await MccRecord.create({
      supervisorName,
      contactNumber,
      cubeNumber: Number(cubeNumber),
      image: req.file.path,
      status: req.body.status || "Stored",
      dateSubmitted: req.body.dateSubmitted || new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "MCC record created successfully",
      data: record,
    });
  } catch (error) {
    console.log("CREATE MCC ERROR:", error);
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
