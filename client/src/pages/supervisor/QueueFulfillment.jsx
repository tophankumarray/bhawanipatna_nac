// src/pages/QueueFulfillment.jsx
// @ts-nocheck

import {
  CheckCircle,
  Clock,
  Package,
  Plus,
  Search,
  ShieldCheck,
  X,
  Camera,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import api from "../../api/api";

/* ================= CONFIG ================= */

const CATEGORY_FILTERS = ["All", "MCC", "MRF"];

const STATUS_STYLE = {
  Pending: "bg-yellow-100 text-yellow-700",
  Verified: "bg-blue-100 text-blue-700",
  Fulfilled: "bg-green-100 text-green-700",
};

const TABLE_HEADERS = [
  "ID",
  "Category",
  "Cube",
  "Supervisor",
  "Status",
  "Date",
  "Image",
];

const STAT_CONFIG = [
  {
    title: "Total",
    key: "total",
    icon: <Package />,
    color: "bg-blue-600",
  },
  {
    title: "Pending",
    key: "Pending",
    icon: <Clock />,
    color: "bg-orange-600",
  },
  {
    title: "Verified",
    key: "Verified",
    icon: <ShieldCheck />,
    color: "bg-purple-600",
  },
  {
    title: "Fulfilled",
    key: "Fulfilled",
    icon: <CheckCircle />,
    color: "bg-green-600",
  },
];

/* ================= REUSABLE ================= */

const StatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-2xl p-5 text-white shadow-lg ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>
      <div className="bg-white/20 p-3 rounded-xl">{icon}</div>
    </div>
  </div>
);

const Input = ({ value }) => (
  <input
    value={value}
    disabled
    className="w-full border rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed"
  />
);

/* ================= MAIN ================= */

const QueueFulfillment = () => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [photo, setPhoto] = useState(null);

  const webcamRef = useRef(null);
  const role = "Supervisor";

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const res = await api.get("/queueFulfillment");
        setRecords(res.data || []);
      } catch {
        toast.error("Failed to load fulfillment records");
      }
    };
    loadRecords();
  }, []);

  /* ================= WEBCAM ================= */

  const capturePhoto = () => {
    const img = webcamRef.current?.getScreenshot();
    setPhoto(img);
  };

  /* ================= FILTER ================= */

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.cube.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "All Status" || r.status === status;

    const matchCategory =
      categoryFilter === "All" || r.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  /* ================= STATS ================= */

  const STAT_VALUES = {
    total: filteredRecords.length,
    Pending: filteredRecords.filter((r) => r.status === "Pending").length,
    Verified: filteredRecords.filter((r) => r.status === "Verified").length,
    Fulfilled: filteredRecords.filter((r) => r.status === "Fulfilled").length,
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!photo) {
      toast.warning("Please capture an image");
      return;
    }

    const newRecord = {
      id: `QF-${new Date().getFullYear()}-${String(
        records.length + 1
      ).padStart(3, "0")}`,
      category: "MCC",
      cube: "Cube-01",
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB"),
      supervisor: "Ramesh Kumar",
      photo,
    };

    try {
      await api.post("/queueFulfillment", newRecord);
      setRecords((prev) => [...prev, newRecord]);
      setPhoto(null);
      setOpen(false);
      toast.success("Record added successfully");
    } catch {
      toast.error("Failed to submit record");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold">
          MCC / MRF Queue Fulfillment
        </h1>
        <p className="text-sm opacity-90">
          Command & Control – Cube-wise operational tracking
        </p>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-3 flex-wrap">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              categoryFilter === cat
                ? "bg-orange-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CONFIG.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={STAT_VALUES[s.key]}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl shadow p-6 flex gap-4">
        <Search className="text-orange-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID / Cube / Category"
          className="w-full border rounded-xl px-4 py-3"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option>All Status</option>
          {Object.keys(STATUS_STYLE).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-100">
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="px-5 py-4 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-5 py-4">{r.id}</td>
                <td className="px-5 py-4">{r.category}</td>
                <td className="px-5 py-4">{r.cube}</td>
                <td className="px-5 py-4">{r.supervisor}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      STATUS_STYLE[r.status]
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4">{r.date}</td>
                <td className="px-5 py-4">
                  {r.photo ? (
                    <img
                      src={r.photo}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD BUTTON */}
      {role === "Supervisor" && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg flex gap-2"
        >
          <Plus /> Add Record
        </button>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden">
            <div className="bg-orange-600 text-white p-4 flex justify-between">
              <h3 className="font-semibold">Fulfillment Entry</h3>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input value="Gopalpur NAC" />
              <Input value="Ramesh Kumar (Supervisor)" />
              <Input value="Auto-captured Date & Time" />

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-xl"
              />

              <button
                onClick={capturePhoto}
                className="w-full bg-orange-600 text-white py-2 rounded-xl flex justify-center gap-2"
              >
                <Camera size={18} /> Capture Image
              </button>

              {photo && (
                <img src={photo} className="max-h-40 mx-auto rounded" />
              )}
            </div>

            <div className="flex justify-end gap-4 p-4 border-t">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-orange-600 text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueFulfillment;
