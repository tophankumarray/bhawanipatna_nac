import MccRecord from "../../models/supervisor/mccRecord.js";
import MrfRecord from "../../models/supervisor/mrfRecord.js";
import MrfAgencySale from "../../models/supervisor/mrfAgencySale.js"; 
// ⚠️ if you don't have this model, comment it

export const resetWealthCenter = async (req, res) => {
  try {
    await MccRecord.deleteMany({});
    await MrfRecord.deleteMany({});
    await MrfAgencySale.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Wealth Center reset successfully ✅",
    });
  } catch (error) {
    console.log("RESET WEALTH CENTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Reset failed ❌",
      error: error.message,
    });
  }
};
