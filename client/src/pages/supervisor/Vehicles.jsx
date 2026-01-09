// @ts-nocheck
// src/pages/supervisor/Vehicles.jsx

import { MapPin, Search, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/api";

/* ================= SUMMARY CONFIG ================= */

const SUMMARY_CARDS = [
  { title: "Total Vehicles", key: "total", color: "bg-blue-600" },
  { title: "Active", key: "Active", color: "bg-green-600" },
  { title: "Maintenance", key: "Maintenance", color: "bg-yellow-500" },
];

/* ================= TABLE HEADERS ================= */

const TABLE_HEADERS = [
  "Vehicle No",
  "Type",
  "Ward",
  "Route",
  "Driver",
  "GPS",
  "Trip",
  "Status",
  "Last Update",
  "Action",
];

/* ================= STATUS STYLES ================= */

const STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  Maintenance: "bg-yellow-100 text-yellow-800",
};

/* ================= VEHICLES PAGE ================= */

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  /* -------- LOAD VEHICLES -------- */
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await api.get("/vehicles");

        setVehicles(
          (res.data || []).map((v) => ({
            id: v.id,
            number: v.number || "N/A",
            type: v.type || "Tipper",
            ward: v.ward || "N/A",
            route: v.route || "Zone A",
            driver: v.driver || "N/A",
            status: v.status || "Inactive",
            gps: v.status === "Active" ? "Online" : "Offline",
            trip:
              v.status === "Active"
                ? "On Route"
                : v.status === "Maintenance"
                ? "Workshop"
                : "Idle",
            updatedAt: "Today",
          }))
        );
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      }
    };

    loadVehicles();
  }, []);

  /* -------- SEARCH FILTER -------- */
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.number.toLowerCase().includes(search.toLowerCase()) ||
      v.ward.toLowerCase().includes(search.toLowerCase()) ||
      v.route.toLowerCase().includes(search.toLowerCase())
  );

  /* -------- SUMMARY VALUES -------- */
  const summaryValues = {
    total: vehicles.length,
    Active: vehicles.filter((v) => v.status === "Active").length,
    Maintenance: vehicles.filter((v) => v.status === "Maintenance").length,
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 shadow flex items-center gap-3">
        <Truck size={28} />
        <div>
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <p className="text-sm opacity-90">
            Fleet monitoring & operational status
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {SUMMARY_CARDS.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={summaryValues[card.key]}
            color={card.color}
          />
        ))}
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by vehicle, ward or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  No vehicles found
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{v.number}</td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3">{v.ward}</td>
                  <td className="px-4 py-3">{v.route}</td>
                  <td className="px-4 py-3">{v.driver}</td>

                  <td className="px-4 py-3">
                    <Badge
                      value={v.gps}
                      color={
                        v.gps === "Online"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    />
                  </td>

                  <td className="px-4 py-3">
                    <Badge value={v.trip} color="bg-blue-100 text-blue-700" />
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {v.updatedAt}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="flex items-center gap-1 text-green-600 hover:underline text-xs"
                    >
                      <MapPin size={14} /> View Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW STATUS MODAL */}
      {selectedVehicle && (
        <VehicleStatusModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
};

/* ================= MODAL ================= */

const VehicleStatusModal = ({ vehicle, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">

      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>

      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Truck size={20} /> Vehicle Status
      </h3>

      <div className="space-y-3 text-sm">
        <Info label="Vehicle No" value={vehicle.number} />
        <Info label="Type" value={vehicle.type} />
        <Info label="Ward" value={vehicle.ward} />
        <Info label="Route" value={vehicle.route} />
        <Info label="Driver" value={vehicle.driver} />
        <Info label="GPS" value={vehicle.gps} />
        <Info label="Trip" value={vehicle.trip} />
        <Info label="Status" value={vehicle.status} />
        <Info label="Last Update" value={vehicle.updatedAt} />
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
);

/* ================= REUSABLE ================= */

const SummaryCard = ({ title, value, color }) => (
  <div className={`rounded-xl p-5 text-white shadow ${color}`}>
    <p className="text-sm opacity-90">{title}</p>
    <h3 className="text-3xl font-bold mt-1">{value}</h3>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      STATUS_STYLES[status]
    }`}
  >
    {status}
  </span>
);

const Badge = ({ value, color }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
    {value}
  </span>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between border-b pb-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Vehicles;
