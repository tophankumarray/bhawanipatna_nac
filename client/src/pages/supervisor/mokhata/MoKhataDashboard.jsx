// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import jsonApi from "../../../api/jsonApi";
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
          todayMade > 0 ? `${Math.round((todaySold / todayMade) * 100)}%` : "0%",
        ],
      ],
      styles: { fontSize: 10 },
    });

    const last10 = transactions.slice().reverse().slice(0, 10);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Type", "Amount", "Date"]],
      body: last10.map((t) => [t.type, t.amount, t.date]),
      styles: { fontSize: 10 },
    });

    doc.save(`mo-khata-report-${todayKey}.pdf`);
  };

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

    if (res.data && res.data.length > 1) {
      const keep = res.data[0];
      const extra = res.data.slice(1);

      for (let d of extra) {
        await jsonApi.delete(`/moKhataDaily/${d.id}`);
      }

      return keep;
    }

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

  /* ================= LOAD DATA ================= */

  const loadMoKhata = async () => {
    try {
      setLoading(true);

      const summary = await ensureSummaryExists();
      setKhataStock(Number(summary.khataStock || 0));

      const todayData = await ensureTodayExists();
      setTodayMade(Number(todayData.todayMade || 0));
      setTodaySold(Number(todayData.todaySold || 0));

      const txRes = await jsonApi.get("/moKhataTransactions");
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error("MoKhata load error:", err?.response?.data || err.message);
      toast.error("MoKhata Load Failed! Check json-server running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoKhata();
  }, []);

  /* ================= ADD KHATA ================= */

  const handleAddKhata = async () => {
    const amount = parseInt(addAmountInput, 10);

    if (isNaN(amount) || amount <= 0) {
      toast.warning("Enter valid amount to add!");
      return;
    }

    try {
      setLoading(true);

      const summary = await ensureSummaryExists();
      const todayData = await ensureTodayExists();

      await jsonApi.patch(`/moKhataSummary/${summary.id}`, {
        khataStock: Number(summary.khataStock || 0) + amount,
      });

      await jsonApi.patch(`/moKhataDaily/${todayData.id}`, {
        todayMade: Number(todayData.todayMade || 0) + amount,
      });

      await jsonApi.post("/moKhataTransactions", {
        id: Date.now().toString(),
        type: "MAKE",
        amount,
        date: new Date().toLocaleString(),
      });

      toast.success(`Added ${amount} khata successfully ✅`);
      setAddAmountInput("");
      await loadMoKhata();
    } catch (err) {
      console.error("Add khata error:", err?.response?.data || err.message);
      toast.error("Add Khata Failed! Check db.json keys & json-server.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELL KHATA ================= */

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

      const summary = await ensureSummaryExists();
      const todayData = await ensureTodayExists();

      await jsonApi.patch(`/moKhataSummary/${summary.id}`, {
        khataStock: Number(summary.khataStock || 0) - amount,
      });

      await jsonApi.patch(`/moKhataDaily/${todayData.id}`, {
        todaySold: Number(todayData.todaySold || 0) + amount,
      });

      await jsonApi.post("/moKhataTransactions", {
        id: Date.now().toString(),
        type: "SELL",
        amount,
        date: new Date().toLocaleString(),
      });

      toast.success(`Sold ${amount} khata successfully ✅`);
      setSoldAmountInput("");
      await loadMoKhata();
    } catch (err) {
      console.error("Sell khata error:", err?.response?.data || err.message);
      toast.error("Sell Khata Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-green-300">
      <MoKhataHeader onBack={() => window.history.back()} onDownloadPDF={handleDownloadPDF} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center font-bold text-gray-700 mb-6">
            Loading...
          </div>
        )}

        <MoKhataStats khataStock={khataStock} todayMade={todayMade} todaySold={todaySold} />

        <MoKhataSummary todayMade={todayMade} todaySold={todaySold} khataStock={khataStock} />

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
