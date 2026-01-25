import MoKhataSummary from "../../models/supervisor/moKhataSummary.model.js";
import MoKhataDaily from "../../models/supervisor/moKhataDaily.model.js";
import MoKhataTransaction from "../../models/supervisor/moKhataTransaction.model.js";

/* ================= HELPERS ================= */

const ensureSummaryExists = async () => {
  let summary = await MoKhataSummary.findOne();
  if (!summary) {
    summary = await MoKhataSummary.create({ khataStock: 0 });
  }
  return summary;
};

const ensureTodayExists = async (todayKey) => {
  let today = await MoKhataDaily.findOne({ date: todayKey });

  if (!today) {
    today = await MoKhataDaily.create({
      date: todayKey,
      todayMade: 0,
      todaySold: 0,
    });
  }

  return today;
};

/* ================= GET DASHBOARD DATA ================= */

export const getMoKhataDashboard = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required in query (?date=YYYY-MM-DD)",
      });
    }

    const summary = await ensureSummaryExists();
    const today = await ensureTodayExists(date);

    const transactions = await MoKhataTransaction.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "MoKhata dashboard fetched successfully",
      data: {
        summary,
        today,
        transactions,
      },
    });
  } catch (error) {
    console.log("GET MOKHATA DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch MoKhata dashboard",
      error: error.message,
    });
  }
};

/* ================= ADD KHATA (MAKE) ================= */

export const addKhata = async (req, res) => {
  try {
    const { date, amount } = req.body;

    if (!date || !amount) {
      return res.status(400).json({
        success: false,
        message: "date and amount are required",
      });
    }

    const qty = Number(amount);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
    }

    const summary = await ensureSummaryExists();
    const today = await ensureTodayExists(date);

    summary.khataStock = Number(summary.khataStock || 0) + qty;
    await summary.save();

    today.todayMade = Number(today.todayMade || 0) + qty;
    await today.save();

    const tx = await MoKhataTransaction.create({
      type: "MAKE",
      amount: qty,
      date: new Date().toLocaleString(),
    });

    return res.status(200).json({
      success: true,
      message: `Added ${qty} khata successfully`,
      data: { summary, today, tx },
    });
  } catch (error) {
    console.log("ADD KHATA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add khata",
      error: error.message,
    });
  }
};

/* ================= SELL KHATA ================= */

export const sellKhata = async (req, res) => {
  try {
    const { date, amount } = req.body;

    if (!date || !amount) {
      return res.status(400).json({
        success: false,
        message: "date and amount are required",
      });
    }

    const qty = Number(amount);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
    }

    const summary = await ensureSummaryExists();
    const today = await ensureTodayExists(date);

    if (qty > Number(summary.khataStock || 0)) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock!",
      });
    }

    summary.khataStock = Number(summary.khataStock || 0) - qty;
    await summary.save();

    today.todaySold = Number(today.todaySold || 0) + qty;
    await today.save();

    const tx = await MoKhataTransaction.create({
      type: "SELL",
      amount: qty,
      date: new Date().toLocaleString(),
    });

    return res.status(200).json({
      success: true,
      message: `Sold ${qty} khata successfully`,
      data: { summary, today, tx },
    });
  } catch (error) {
    console.log("SELL KHATA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sell khata",
      error: error.message,
    });
  }
};
