
import MccRecord from "../../models/supervisor/mccRecord.js";
import MrfRecord from "../../models/supervisor/mrfRecord.js";
import MrfAgencySale from "../../models/supervisor/mrfAgencySale.js";
// ✅ CREATE AGENCY SALE
export const createAgencySale = async (req, res) => {
  try {
    const { agencyName, material, weightKg, ratePerKg, totalAmount, dateSubmitted } =
      req.body;

    if (!agencyName || !material || !weightKg || !ratePerKg) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const sale = await MrfAgencySale.create({
      agencyName,
      material,
      weightKg: Number(weightKg),
      ratePerKg: Number(ratePerKg),
      totalAmount: totalAmount
        ? Number(totalAmount)
        : Number(weightKg) * Number(ratePerKg),
      dateSubmitted: dateSubmitted || new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "Agency sale stored successfully ✅",
      data: sale,
    });
  } catch (error) {
    console.log("CREATE AGENCY SALE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create agency sale",
      error: error.message,
    });
  }
};

// ✅ GET ALL AGENCY SALES
export const getAllAgencySales = async (req, res) => {
  try {
    const sales = await MrfAgencySale.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.log("GET AGENCY SALES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch agency sales",
      error: error.message,
    });
  }
};
/* ✅ RESET ALL (MCC + MRF + Agency Sales) */
export const resetWealthCenter = async (req, res) => {
  try {
    await MccRecord.deleteMany({});
    await MrfRecord.deleteMany({});
    await MrfAgencySale.deleteMany({});

    res.status(200).json({
      success: true,
      message: "Wealth Center Reset Successfully ✅ (MCC + MRF + Agency Sales cleared)",
    });
  } catch (error) {
    console.log("RESET WEALTH CENTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Reset failed ❌",
      error: error.message,
    });
  }
};