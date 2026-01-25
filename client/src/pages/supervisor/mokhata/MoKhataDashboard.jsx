// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/api"; // ✅ backend axios (5900)
import { toast } from "react-toastify";

/* PDF */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MoKhataHeader from "./components/MoKhataHeader";
import MoKhataStats from "./components/MoKhataStats";
import MoKhataSummary from "./components/MoKhataSummary";
import MoKhataActions from "./components/MoKhataActions";
import MoKhataTransactions from "./components/MoKhataTransactions";
import MoKhataFooter from "./components/MoKhataFooter";

import { getTodayKey } from "./utils/moKhataHelpers";

const MoKhataDashboard = () => {
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
          todayMade > 0
            ? `${Math.round((todaySold / todayMade) * 100)}%`
            : "0%",
        ],
      ],
      styles: { fontSize: 10 },
    });

    const last10 = transactions.slice(0, 10); // already sorted latest first

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Type", "Amount", "Date"]],
      body: last10.map((t) => [t.type, t.amount, t.date]),
      styles: { fontSize: 10 },
    });

    doc.save(`mo-khata-report-${todayKey}.pdf`);
  };

  /* ================= LOAD DATA (Backend) ================= */
  const loadMoKhata = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/mokhata/dashboard?date=${todayKey}`);

      const summary = res?.data?.data?.summary;
      const todayData = res?.data?.data?.today;
      const tx = res?.data?.data?.transactions || [];

      setKhataStock(Number(summary?.khataStock || 0));
      setTodayMade(Number(todayData?.todayMade || 0));
      setTodaySold(Number(todayData?.todaySold || 0));
      setTransactions(Array.isArray(tx) ? tx : []);
    } catch (err) {
      console.error("MoKhata load error:", err?.response?.data || err.message);
      toast.error("MoKhata Load Failed! Check backend running on port 5900.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoKhata();
  }, []);

  /* ================= ADD KHATA (Backend) ================= */
  const handleAddKhata = async () => {
    const amount = parseInt(addAmountInput, 10);

    if (isNaN(amount) || amount <= 0) {
      toast.warning("Enter valid amount to add!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/mokhata/add", {
        date: todayKey,
        amount,
      });

      toast.success(`Added ${amount} khata successfully ✅`);
      setAddAmountInput("");
      await loadMoKhata();
    } catch (err) {
      console.error("Add khata error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Add Khata Failed!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELL KHATA (Backend) ================= */
  const handleSoldKhata = async () => {
    const amount = parseInt(soldAmountInput, 10);

    if (isNaN(amount) || amount <= 0) {
      toast.warning("Enter valid sold amount!");
      return;
    }

    if (amount > khataStock) {
      toast.error("Not enough stock!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/mokhata/sell", {
        date: todayKey,
        amount,
      });

      toast.success(`Sold ${amount} khata successfully ✅`);
      setSoldAmountInput("");
      await loadMoKhata();
    } catch (err) {
      console.error("Sell khata error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Sell Khata Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-green-300">
      <MoKhataHeader
        onBack={() => window.history.back()}
        onDownloadPDF={handleDownloadPDF}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center font-bold text-gray-700 mb-6">
            Loading...
          </div>
        )}

        <MoKhataStats
          khataStock={khataStock}
          todayMade={todayMade}
          todaySold={todaySold}
        />

        <MoKhataSummary
          todayMade={todayMade}
          todaySold={todaySold}
          khataStock={khataStock}
        />

        <MoKhataActions
          addAmountInput={addAmountInput}
          setAddAmountInput={setAddAmountInput}
          soldAmountInput={soldAmountInput}
          setSoldAmountInput={setSoldAmountInput}
          onAdd={handleAddKhata}
          onSell={handleSoldKhata}
          loading={loading}
          khataStock={khataStock}
        />

        <MoKhataTransactions transactions={transactions} />
      </div>

      <MoKhataFooter />
    </div>
  );
};

export default MoKhataDashboard;
