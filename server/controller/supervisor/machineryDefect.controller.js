import MachineryDefect from "../../models/supervisor/machineryDefect.model.js";

/**
 * SUPERVISOR → CREATE
 * POST /api/machinery-defects
 */
export const createMachineryDefect = async (req, res) => {
  try {
    const defect = await MachineryDefect.create({
      ...req.body,
      image: req.file?.path,
    });

    res.status(201).json({
      success: true,
      message: "Machinery defect reported successfully",
      data: defect,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create machinery defect",
      error: error.message,
    });
  }
};

/**
 * SUPERVISOR → GET ALL
 * GET /api/machinery-defects
 */
export const getAllMachineryDefects = async (req, res) => {
  try {
    const defects = await MachineryDefect.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: defects.length,
      data: defects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch machinery defects",
      error: error.message,
    });
  }
};

/**
 * SUPERVISOR → UPDATE BY ID
 * PUT /api/machinery-defects/:id
 */
export const updateMachineryDefect = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;

    const updated = await MachineryDefect.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Machinery defect not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Machinery defect updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update machinery defect",
      error: error.message,
    });
  }
};
