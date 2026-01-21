import Ward from "../../models/admin/ward.model.js";

/**
 * CREATE WARD
 */
export const createWard = async (req, res) => {
  try {
    const ward = await Ward.create(req.body);

    res.status(201).json({
      success: true,
      message: "Ward created successfully",
      data: ward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ward",
      error: error.message,
    });
  }
};

/**
 * GET ALL WARDS
 */
export const getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wards.length,
      data: wards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wards",
      error: error.message,
    });
  }
};

