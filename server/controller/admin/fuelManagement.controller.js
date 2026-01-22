import FuelManagement from "../../models/admin/fuelManagement.model.js";

/**
 * ADMIN → CREATE
 * POST /api/fuel-management
 */
export const createFuelEntry = async (req, res) => {
  try {
    const fuelEntry = await FuelManagement.create(req.body);

    res.status(201).json({
      success: true,
      message: "Fuel entry created successfully",
      data: fuelEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create fuel entry",
      error: error.message,
    });
  }
};

/**
 * ADMIN → GET ALL
 * GET /api/fuel-management
 */
export const getAllFuelEntries = async (req, res) => {
  try {
    const fuelEntries = await FuelManagement.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: fuelEntries.length,
      data: fuelEntries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel entries",
      error: error.message,
    });
  }
};

/**
 * ADMIN → UPDATE BY ID
 * PUT /api/fuel-management/:id
 */
export const updateFuelEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await FuelManagement.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Fuel entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fuel entry updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update fuel entry",
      error: error.message,
    });
  }
};

/**
 * ADMIN → DELETE BY ID
 * DELETE /api/fuel-management/:id
 */
export const deleteFuelEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FuelManagement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Fuel entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fuel entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete fuel entry",
      error: error.message,
    });
  }
};
