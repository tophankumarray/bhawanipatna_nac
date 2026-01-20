// @ts-nocheck
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import StatsCard from "../../components/admin/StatsCard";

const FuelManagement = () => {
  const [fuelRecords, setFuelRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    vehicle: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchFuelRecords();
  }, []);

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get("/fuelRecords");
      setFuelRecords(res.data);
    } catch (err) {
      console.warn("API error", err);
      setFuelRecords([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredRecords = fuelRecords.filter((r) => {
    const q = filters.search.toLowerCase();
    return (
      (filters.vehicle === "all" || r.vehicle === filters.vehicle) &&
      (filters.type === "all" || r.fuelType === filters.type) &&
      (!filters.dateFrom || r.refuelDate >= filters.dateFrom) &&
      (!filters.dateTo || r.refuelDate <= filters.dateTo) &&
      (r.vehicle.toLowerCase().includes(q) ||
        r.driver.toLowerCase().includes(q) ||
        r.fillingStation.toLowerCase().includes(q))
    );
  });

  /* ================= STATS ================= */
  const stats = {
    totalRecords: fuelRecords.length,
    totalFuel: fuelRecords
      .reduce((s, r) => s + Number(r.quantity || 0), 0)
      .toFixed(1),
    totalCost: fuelRecords
      .reduce((s, r) => s + Number(r.totalCost || 0), 0)
      .toFixed(2),
    avgEfficiency:
      fuelRecords.length > 0
        ? (
            fuelRecords.reduce(
              (s, r) => s + Number(r.efficiency || 0),
              0
            ) / fuelRecords.length
          ).toFixed(2)
        : "0",
    dieselRecords: fuelRecords.filter((r) => r.fuelType === "diesel").length,
    petrolRecords: fuelRecords.filter((r) => r.fuelType === "petrol").length,
  };

  const getUniqueVehicles = () => {
    return [...new Set(fuelRecords.map((r) => r.vehicle))].sort();
  };

  /* ================= THEMED CARDS ================= */
  const statsCards = [
    {
      title: "TOTAL RECORDS",
      value: stats.totalRecords,
      icon: "📊",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "TOTAL FUEL",
      value: `${stats.totalFuel} L`,
      icon: "⛽",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "TOTAL COST",
      value: `₹${stats.totalCost}`,
      icon: "💰",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "AVG EFFICIENCY",
      value: `${stats.avgEfficiency} km/L`,
      icon: "📈",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  /* ================= PDF EXPORT (FIXED) ================= */
  const downloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129);
      doc.text("Fuel Management Report", 14, 16);

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 23);

      autoTable(doc, {
        startY: 28,
        head: [["Metric", "Value"]],
        body: [
          ["Total Records", stats.totalRecords],
          ["Total Fuel", `${stats.totalFuel} L`],
          ["Total Cost", `₹${stats.totalCost}`],
          ["Avg Efficiency", `${stats.avgEfficiency} km/L`],
          ["Diesel Records", stats.dieselRecords],
          ["Petrol Records", stats.petrolRecords],
        ],
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 65, fontStyle: "bold" },
          1: { cellWidth: 85 },
        },
      });

      const startY = doc.lastAutoTable?.finalY || 35;

      doc.setFontSize(12);
      doc.text("Fuel Records", 14, startY + 8);

      autoTable(doc, {
        startY: startY + 12,
        head: [
          [
            "ID",
            "Vehicle",
            "Driver",
            "Date",
            "Fuel",
            "Qty(L)",
            "₹/L",
            "Total ₹",
            "Odometer",
            "Efficiency",
            "Station",
          ],
        ],
        body: filteredRecords.map((r) => [
          r.id,
          r.vehicle,
          r.driver,
          r.refuelDate,
          r.fuelType.toUpperCase(),
          r.quantity,
          r.pricePerLiter,
          r.totalCost,
          r.odometer,
          r.efficiency || "N/A",
          r.fillingStation,
        ]),
        theme: "striped",
        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: 255,
          fontSize: 8,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 22 },
          2: { cellWidth: 22 },
          3: { cellWidth: 18 },
          4: { cellWidth: 14 },
          5: { cellWidth: 14 },
          6: { cellWidth: 14 },
          7: { cellWidth: 16 },
          8: { cellWidth: 18 },
          9: { cellWidth: 18 },
          10: { cellWidth: 30 },
        },
        margin: { left: 10, right: 10 },
      });

      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pages}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      }

      doc.save(`Fuel_Report_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600">
                Fuel Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Track and manage vehicle fuel consumption
              </p>
            </div>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {statsCards.map((card, i) => (
            <StatsCard key={i} {...card} showButton={false} />
          ))}
        </div>

        {/* Fuel Type Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Fuel Type Distribution
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Diesel</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats.dieselRecords}
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">⛽</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Petrol</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {stats.petrolRecords}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">⛽</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Vehicle, Driver, Station..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle
              </label>
              <select
                value={filters.vehicle}
                onChange={(e) =>
                  setFilters({ ...filters, vehicle: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Vehicles</option>
                {getUniqueVehicles().map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="cng">CNG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Fuel Records */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Fuel Records
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500"></div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="text-4xl sm:text-6xl mb-4">⛽</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                No Fuel Records Found
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Try adjusting your filters or add a new fuel record
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-emerald-500 to-teal-500">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Vehicle
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Fuel Type
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Quantity
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Cost
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Odometer
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Efficiency
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Station
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-emerald-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {r.id}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-gray-900">
                            {r.vehicle}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-600">
                            {r.driver}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-900">
                          {r.refuelDate}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            r.fuelType === "diesel"
                              ? "bg-blue-100 text-blue-700"
                              : r.fuelType === "petrol"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {r.fuelType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-blue-600">
                          {r.quantity} L
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-emerald-600">
                            ₹{r.totalCost}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-600">
                            @ ₹{r.pricePerLiter}/L
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-900">
                          {r.odometer} km
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-purple-600">
                          {r.efficiency || "N/A"} km/L
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <span className="text-xs sm:text-sm text-gray-900">
                          {r.fillingStation}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm transition-colors">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-semibold text-xs sm:text-sm transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuelManagement;
