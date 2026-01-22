import WasteCollection from "../../models/admin/wasteCollection.model.js";

/**
 * ADMIN → CREATE
 * POST /api/waste-collections
 */
export const createWasteCollection = async (req, res) => {
  try {
    const collection = await WasteCollection.create(req.body);

    res.status(201).json({
      success: true,
      message: "Waste collection created successfully",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create waste collection",
      error: error.message,
    });
  }
};

/**
 * ADMIN → GET ALL
 * GET /api/waste-collections
 */
export const getAllWasteCollections = async (req, res) => {
  try {
    const collections = await WasteCollection.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch waste collections",
      error: error.message,
    });
  }
};

/**
 * ADMIN → UPDATE BY ID
 * PUT /api/waste-collections/:id
 */
export const updateWasteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await WasteCollection.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Waste collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Waste collection updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update waste collection",
      error: error.message,
    });
  }
};

/**
 * ADMIN → DELETE BY ID
 * DELETE /api/waste-collections/:id
 */
export const deleteWasteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await WasteCollection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Waste collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Waste collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete waste collection",
      error: error.message,
    });
  }
};
