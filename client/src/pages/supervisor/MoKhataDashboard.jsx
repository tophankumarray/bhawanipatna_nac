// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Package,
  Plus,
  Minus,
  TrendingUp,
  ShoppingCart,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsonApi from "../../api/jsonApi";

/* ✅ PDF */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * MO KHATA SYSTEM (NO REDUX)
 * - Stock = total khata available
 * - Today Made = added today
 * - Today Sold = sold today
 * - Data stored in json-server (db.json)
 */

const getTodayKey = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
};

const MoKhataDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [addAmountInput, setAddAmountInput] = useState("");
  const [soldAmountInput, setSoldAmountInput] = useState("");

  const [khataStock, setKhataStock] = useState(0);
  const [todayMade, setTodayMade] = useState(0);
  const [todaySold, setTodaySold] = useState(0);

  const [transactions, setTransactions] = useState([]);

  const todayKey = useMemo(() => getTodayKey(), []);

  /* ================= PDF DOWNLOAD ================= */

  const handleDownloadPDF = () => {
    const doc = new jsPDF("portrait");

    doc.setFontSize(16);
    doc.text("Mo Khata Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Date: ${todayKey}`, 14, 24);

    // Summary table
    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        ["Current Stock", khataStock],
        ["Today Made", todayMade],
        ["Today Sold", todaySold],
        ["Net Change Today", todayMade - todaySold],
        [
          "Sales Rate",
          todayMade > 0 ? `${Math.round((todaySold / todayMade) * 100)}%` : "0%",
        ],
      ],
      styles: { fontSize: 10 },
    });

    // Transactions table (Last 10)
    const last10 = transactions.slice().reverse().slice(0, 10);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Type", "Amount", "Date"]],
      body: last10.map((t) => [t.type, t.amount, t.date]),
      styles: { fontSize: 10 },
    });

    doc.save(`mo-khata-report-${todayKey}.pdf`);
  };

  /* ================= LOAD DATA ================= */

  const loadMoKhata = async () => {
    try {
      setLoading(true);

      // 1) summary
      const summaryRes = await jsonApi.get("/moKhataSummary");
      const summary = summaryRes.data?.[0];

      if (summary) {
        setKhataStock(Number(summary.khataStock || 0));
      } else {
        const created = await jsonApi.post("/moKhataSummary", {
          id: 1,
          khataStock: 0,
        });
        setKhataStock(Number(created.data.khataStock || 0));
      }

      // 2) today report
      const todayRes = await jsonApi.get(`/moKhataDaily?date=${todayKey}`);
      const todayData = todayRes.data?.[0];

      if (todayData) {
        setTodayMade(Number(todayData.todayMade || 0));
        setTodaySold(Number(todayData.todaySold || 0));
      } else {
        const allDays = await jsonApi.get("/moKhataDaily");
        const nextId = (allDays.data?.length || 0) + 1;

        await jsonApi.post("/moKhataDaily", {
          id: nextId,
          date: todayKey,
          todayMade: 0,
          todaySold: 0,
        });

        setTodayMade(0);
        setTodaySold(0);
      }

      // 3) history
      const txRes = await jsonApi.get("/moKhataTransactions");
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error("MoKhata load error:", err?.response?.data || err.message);
      alert("MoKhata Load Failed! Check json-server running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoKhata();
  }, []);

  /* ================= HELPERS ================= */

  const ensureSummaryExists = async () => {
    const res = await jsonApi.get("/moKhataSummary");

    if (!res.data || res.data.length === 0) {
      const created = await jsonApi.post("/moKhataSummary", {
        id: 1,
        khataStock: 0,
      });
      return created.data;
    }

    return res.data[0];
  };

  const ensureTodayExists = async () => {
    const res = await jsonApi.get(`/moKhataDaily?date=${todayKey}`);

    if (!res.data || res.data.length === 0) {
      const allDays = await jsonApi.get("/moKhataDaily");
      const nextId = (allDays.data?.length || 0) + 1;

      const created = await jsonApi.post("/moKhataDaily", {
        id: nextId,
        date: todayKey,
        todayMade: 0,
        todaySold: 0,
      });

      return created.data;
    }

    return res.data[0];
  };

  /* ================= ADD KHATA ================= */

  const handleAddKhata = async () => {
    const amount = parseInt(addAmountInput, 10);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter valid amount to add!");
      return;
    }

    try {
      setLoading(true);

      const summary = await ensureSummaryExists();
      const todayData = await ensureTodayExists();

      // update stock
      await jsonApi.patch(`/moKhataSummary/${summary.id}`, {
        khataStock: Number(summary.khataStock || 0) + amount,
      });

      // update today made
      await jsonApi.patch(`/moKhataDaily/${todayData.id}`, {
        todayMade: Number(todayData.todayMade || 0) + amount,
      });

      // transaction
      await jsonApi.post("/moKhataTransactions", {
        type: "MAKE",
        amount,
        date: new Date().toLocaleString(),
      });

      setAddAmountInput("");
      await loadMoKhata();
    } catch (err) {
      console.error("Add khata error:", err?.response?.data || err.message);
      alert("Failed to add khata! (Check json-server + db.json)");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELL KHATA ================= */

  const handleSoldKhata = async () => {
    const amount = parseInt(soldAmountInput, 10);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter valid sold amount!");
      return;
    }

    if (amount > khataStock) {
      alert("Not enough stock!");
      return;
    }

    try {
      setLoading(true);

      const summary = await ensureSummaryExists();
      const todayData = await ensureTodayExists();

      // update stock
      await jsonApi.patch(`/moKhataSummary/${summary.id}`, {
        khataStock: Number(summary.khataStock || 0) - amount,
      });

      // update today sold
      await jsonApi.patch(`/moKhataDaily/${todayData.id}`, {
        todaySold: Number(todayData.todaySold || 0) + amount,
      });

      // transaction
      await jsonApi.post("/moKhataTransactions", {
        type: "SELL",
        amount,
        date: new Date().toLocaleString(),
      });

      setSoldAmountInput("");
      await loadMoKhata();
    } catch (err) {
      console.error("Sell khata error:", err?.response?.data || err.message);
      alert("Failed to sell khata!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-green-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 cursor-pointer"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Mo Khata
                </h1>
              </div>
            </div>

            {/* ✅ PDF DOWNLOAD BUTTON */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:scale-105"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center font-bold text-gray-700 mb-6">
            Loading...
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stock */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="text-indigo-100 text-sm font-medium mb-2">
                Current Stock
              </p>
              <p className="text-5xl font-bold text-white mb-2">{khataStock}</p>
              <p className="text-indigo-200 text-sm">Khata</p>
            </div>
          </div>

          {/* Made */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="text-emerald-100 text-sm font-medium mb-2">
                Today Made
              </p>
              <p className="text-5xl font-bold text-white mb-2">{todayMade}</p>
              <p className="text-emerald-200 text-sm">Added</p>
            </div>
          </div>

          {/* Sold */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="text-red-100 text-sm font-medium mb-2">
                Today Sold
              </p>
              <p className="text-5xl font-bold text-white mb-2">{todaySold}</p>
              <p className="text-red-200 text-sm">Sold</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Daily Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <p className="text-purple-100 text-sm mb-2 font-medium">
                Net Change Today
              </p>
              <p className="text-4xl font-bold">
                {todayMade - todaySold > 0 ? "+" : ""}
                {todayMade - todaySold}
              </p>
              <p className="text-purple-200 text-xs mt-2">Khata</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <p className="text-purple-100 text-sm mb-2 font-medium">
                Sales Rate
              </p>
              <p className="text-4xl font-bold">
                {todayMade > 0 ? Math.round((todaySold / todayMade) * 100) : 0}%
              </p>
              <p className="text-purple-200 text-xs mt-2">Conversion</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <p className="text-purple-100 text-sm mb-2 font-medium">
                Remaining Stock
              </p>
              <p className="text-4xl font-bold">{khataStock}</p>
              <p className="text-purple-200 text-xs mt-2">Available</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[90%] mx-auto">
          {/* Add */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100 hover:border-green-300 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Add Khata
              </h3>
            </div>

            <input
              type="number"
              value={addAmountInput}
              onChange={(e) => setAddAmountInput(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold text-gray-800 transition-all duration-200 mb-5"
              min="1"
            />

            <button
              onClick={handleAddKhata}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Add to Stock
            </button>
          </div>

          {/* Sell */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100 hover:border-orange-300 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                <Minus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Sold Khata
              </h3>
            </div>

            <input
              type="number"
              value={soldAmountInput}
              onChange={(e) => setSoldAmountInput(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold text-gray-800 transition-all duration-200 mb-5"
              min="1"
              max={khataStock}
            />

            <button
              onClick={handleSoldKhata}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Mark as Sold
            </button>
          </div>
        </div>

        {/* History */}
        <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Transactions History
          </h3>

          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions
                .slice()
                .reverse()
                .slice(0, 10)
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 border rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {t.type === "MAKE" ? "➕ Made" : "➖ Sold"} : {t.amount}
                      </p>
                      <p className="text-sm text-gray-500">{t.date}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.type === "MAKE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.type}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Mo Khata Management System - NAC. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MoKhataDashboard;
