// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Camera,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Cuboid,
  Plus,
  Shield,
  RotateCcw,
  Store,
  Factory,
  BadgeIndianRupee,
  Download,
} from "lucide-react";
import Webcam from "react-webcam";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= Reusable Components ================= */

const FormModal = ({
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
  extraActions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 sm:p-8 flex justify-between items-center rounded-t-3xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
          {children}

          {/* Bottom Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            {/* Extra Actions (PDF etc.) */}
            {extraActions}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 shadow-lg flex items-center justify-center gap-2"
            >
              Submit Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  readOnly = false,
  error,
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && !readOnly && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
        readOnly
          ? "bg-gray-100 border-gray-300 cursor-not-allowed"
          : error
          ? "bg-white border-red-500 focus:ring-2 focus:ring-red-500"
          : "bg-white border-gray-300 focus:ring-2 focus:ring-amber-500 hover:border-gray-400"
      }`}
      required={required && !readOnly}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options, required = true }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:ring-2 focus:ring-amber-500 transition-all duration-200 font-medium hover:border-gray-400"
      required={required}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const CameraField = ({ photo, onCapture, webcamRef }) => (
  <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50">
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={{
        width: 400,
        height: 300,
        facingMode: "environment",
      }}
      className="rounded-xl w-full mb-4 shadow-md"
    />

    <div className="flex justify-center">
      <button
        type="button"
        onClick={onCapture}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
      >
        <Camera className="h-5 w-5" />
        Capture Image
      </button>
    </div>

    {photo && (
      <div className="mt-6">
        <p className="text-xs text-gray-600 font-semibold mb-3">Preview:</p>
        <img
          src={photo}
          alt="Captured"
          className="rounded-xl max-h-40 mx-auto shadow-md border-2 border-amber-200 object-contain"
        />
      </div>
    )}
  </div>
);

/* ================= Helpers ================= */

const formatDateTime = () => new Date().toISOString();

const MCC_CUBES = Array.from({ length: 14 }, (_, i) => `${i + 1}`);
const MRF_CUBES = Array.from({ length: 6 }, (_, i) => `${i + 1}`);

/* ================= Main Component ================= */

function WealthCenter() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("MCC");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showAgency, setShowAgency] = useState(false);

  const [mccRecords, setMccRecords] = useState([]);
  const [mrfRecords, setMrfRecords] = useState([]);
  const [agencySales, setAgencySales] = useState([]);

  const [loading, setLoading] = useState(false);

  const webcamRef = useRef(null);

  const [recordFormData, setRecordFormData] = useState({
    wealthCenter: "Buguda NAC",
    supervisorName: "",
    phoneNo: "",
    cubeNumber: "",
    photo: null,
  });

  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    material: "Khata",
    weightKg: "",
    ratePerKg: "",
  });

  /* ================= Load Data ================= */

  const loadAll = async () => {
    try {
      setLoading(true);
      const [mccRes, mrfRes, salesRes] = await Promise.all([
        api.get("/mccRecords"),
        api.get("/mrfRecords"),
        api.get("/mrfAgencySales"),
      ]);

      setMccRecords(mccRes.data || []);
      setMrfRecords(mrfRes.data || []);
      setAgencySales(salesRes.data || []);
    } catch (err) {
      console.error("WealthCenter load error:", err);
      alert("❌ Failed to load data. Check json-server & baseURL");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= Cube Logic ================= */

  const filledMcc = useMemo(
    () => new Set((mccRecords || []).map((r) => Number(r.cubeNumber))),
    [mccRecords]
  );

  const filledMrf = useMemo(
    () => new Set((mrfRecords || []).map((r) => Number(r.cubeNumber))),
    [mrfRecords]
  );

  const availableCubes = useMemo(() => {
    if (activeTab === "MCC") {
      return MCC_CUBES.filter((c) => !filledMcc.has(Number(c)));
    }
    return MRF_CUBES.filter((c) => !filledMrf.has(Number(c)));
  }, [activeTab, filledMcc, filledMrf]);

  /* ================= Validation ================= */

  const validatePhone = (value) => /^\d{10}$/.test(value);

  const canSubmit = () => {
    return (
      recordFormData.supervisorName.trim() &&
      validatePhone(recordFormData.phoneNo) &&
      recordFormData.cubeNumber &&
      recordFormData.photo
    );
  };

  const capturePhoto = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setRecordFormData((p) => ({ ...p, photo: img }));
  };

  /* ================= Submit Record ================= */

  const handleSubmitRecord = async (e) => {
    e.preventDefault();

    if (!canSubmit()) {
      alert("⚠️ Fill all fields + capture photo!");
      return;
    }

    try {
      const payload = {
        wealthCenter: recordFormData.wealthCenter,
        supervisorName: recordFormData.supervisorName,
        phoneNo: recordFormData.phoneNo,
        cubeNumber: Number(recordFormData.cubeNumber),
        photo: recordFormData.photo,
        status: "Stored",
        dateSubmitted: formatDateTime(),
      };

      if (activeTab === "MCC") {
        await api.post("/mccRecords", { ...payload, type: "MCC" });
      } else {
        await api.post("/mrfRecords", { ...payload, type: "MRF" });
      }

      await loadAll();
      setShowRecordForm(false);

      setRecordFormData({
        wealthCenter: "Buguda NAC",
        supervisorName: "",
        phoneNo: "",
        cubeNumber: "",
        photo: null,
      });
    } catch (err) {
      console.error("Submit record error:", err);
      alert("❌ Submit failed! Check json-server running.");
    }
  };

  /* ================= Reset All ================= */

  const resetAll = async () => {
    if (!window.confirm("Reset all MCC + MRF + Sales records?")) return;

    try {
      const allMcc = await api.get("/mccRecords");
      const allMrf = await api.get("/mrfRecords");
      const allSales = await api.get("/mrfAgencySales");

      await Promise.all([
        ...(allMcc.data || []).map((r) => api.delete(`/mccRecords/${r.id}`)),
        ...(allMrf.data || []).map((r) => api.delete(`/mrfRecords/${r.id}`)),
        ...(allSales.data || []).map((r) =>
          api.delete(`/mrfAgencySales/${r.id}`)
        ),
      ]);

      await loadAll();
    } catch (err) {
      console.error("Reset error:", err);
      alert("❌ Reset failed!");
    }
  };

  /* ================= Filtered Records ================= */

  const currentRecords = activeTab === "MCC" ? mccRecords : mrfRecords;

  const filteredRecords = useMemo(() => {
    return (currentRecords || []).filter((r) => {
      const matchesSearch =
        r.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r.id).includes(searchTerm) ||
        String(r.cubeNumber).includes(searchTerm);

      const matchesStatus = statusFilter === "All" || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [currentRecords, searchTerm, statusFilter]);

  /* ================= PDF DOWNLOAD (AGENCY SALES) ================= */

  const downloadAgencyPDF = () => {
    if (!agencySales || agencySales.length === 0) {
      alert("No Agency Sales records found!");
      return;
    }

    const doc = new jsPDF("portrait");

    doc.setFontSize(16);
    doc.text("MRF Agency Sales Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 23);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "ID",
          "Agency",
          "Material",
          "Weight (KG)",
          "Rate (₹)",
          "Total (₹)",
          "Date",
        ],
      ],
      body: agencySales
        .slice()
        .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .map((s) => [
          `AG-${s.id}`,
          s.agencyName || "N/A",
          s.material || "N/A",
          s.weightKg || 0,
          s.ratePerKg || 0,
          s.totalAmount || 0,
          s.dateSubmitted ? new Date(s.dateSubmitted).toLocaleString() : "N/A",
        ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [245, 158, 11] },
    });

    doc.save(`agency-sales-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-gradient-to-r mx-auto max-w-7xl rounded-xl from-yellow-600 to-green-700 text-white py-6 px-4 sm:px-6 shadow-2xl mt-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Cuboid className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Wealth Center</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Tabs + Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab("MCC")}
            className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === "MCC"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Store className="h-5 w-5" /> MCC
          </button>

          <button
            onClick={() => setActiveTab("MRF")}
            className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === "MRF"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Factory className="h-5 w-5" /> MRF
          </button>

          <button
            onClick={() => {
              if (activeTab === "MCC") navigate("/supervisor/mokhata");
              else setShowAgency(true);
            }}
            className={`px-6 py-3 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-200 flex items-center gap-2 ${
              activeTab === "MCC"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                : "bg-gradient-to-r from-green-600 to-emerald-600"
            }`}
          >
            {activeTab === "MCC" ? (
              <>
                <Cuboid className="h-5 w-5" /> MO Khata
              </>
            ) : (
              <>
                <BadgeIndianRupee className="h-5 w-5" /> Agency
              </>
            )}
          </button>

          <button
            onClick={() => setShowRecordForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Record
          </button>

          <button
            onClick={resetAll}
            className="px-6 py-3 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-2 sm:ml-auto"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by supervisor, id, cube..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="relative w-full md:w-52">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white font-semibold"
              >
                <option value="All">All Status</option>
                <option value="Stored">Stored</option>
                <option value="Sent">Sent</option>
                <option value="Received">Received</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Records */}
        {loading ? (
          <div className="text-center text-gray-600 font-semibold">
            Loading records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 sm:p-20 text-center border border-gray-100">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No Records Found
            </h3>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRecords
              .slice()
              .sort(
                (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
              )
              .map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                          <Cuboid className="h-8 w-8 text-white" />
                        </div>

                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                            {activeTab}-{record.id}
                          </h3>
                          <p className="text-gray-600 font-semibold">
                            Cube #{record.cubeNumber}
                          </p>
                        </div>
                      </div>

                      <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 w-fit">
                        {record.status || "Stored"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center space-x-4 bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                          <User className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-600 font-bold mb-1">
                              Supervisor
                            </p>
                            <p className="font-bold text-gray-800 text-base">
                              {record.supervisorName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200">
                          <Phone className="h-6 w-6 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-600 font-bold mb-1">
                              Contact
                            </p>
                            <p className="font-bold text-gray-800 text-base">
                              {record.phoneNo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border-2 border-orange-200">
                          <Calendar className="h-6 w-6 text-orange-600" />
                          <div>
                            <p className="text-xs text-gray-600 font-bold mb-1">
                              Date & Time
                            </p>
                            <p className="font-bold text-gray-800 text-base">
                              {new Date(record.dateSubmitted).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-1 flex items-center justify-center">
                        {record.photo ? (
                          <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg w-full h-44">
                            <img
                              src={record.photo}
                              alt="Record"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-gray-400 italic text-sm w-full h-44 border-2 border-dashed border-gray-300 rounded-xl">
                            No image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      <FormModal
        title={`${activeTab} Add Record`}
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSubmit={handleSubmitRecord}
      >
        <InputField
          label="Wealth Center"
          value={recordFormData.wealthCenter}
          readOnly
        />

        <InputField
          label="Supervisor Name"
          value={recordFormData.supervisorName}
          onChange={(v) =>
            setRecordFormData((p) => ({ ...p, supervisorName: v }))
          }
        />

        <InputField
          label="Contact Number"
          type="tel"
          value={recordFormData.phoneNo}
          onChange={(v) =>
            setRecordFormData((p) => ({
              ...p,
              phoneNo: v.replace(/\D/g, "").slice(0, 10),
            }))
          }
          error={
            recordFormData.phoneNo && !validatePhone(recordFormData.phoneNo)
              ? "Contact number must be exactly 10 digits."
              : ""
          }
          maxLength={10}
        />

        <SelectField
          label="Cube Number"
          value={recordFormData.cubeNumber}
          onChange={(v) => setRecordFormData((p) => ({ ...p, cubeNumber: v }))}
          options={availableCubes}
        />

        <div className="text-sm text-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-amber-200">
          <div className="flex gap-2 items-start">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Auto-filled Information
              </p>
              <p className="text-gray-700">📅 Date & Time auto-recorded</p>
              <p className="text-gray-700">📍 Image geo-tag in production</p>
            </div>
          </div>
        </div>

        <CameraField
          photo={recordFormData.photo}
          onCapture={capturePhoto}
          webcamRef={webcamRef}
        />

        {!canSubmit() && (
          <div className="text-center py-2 text-red-600 font-medium">
            Please fill all required fields and capture an image.
          </div>
        )}
      </FormModal>

      {/* Agency Modal */}
      <FormModal
        title="MRF Agency Sell (KG)"
        isOpen={showAgency}
        onClose={() => setShowAgency(false)}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const weight = Number(agencyForm.weightKg);
            const rate = Number(agencyForm.ratePerKg);

            if (!agencyForm.agencyName || !weight || !rate) {
              alert("Fill all agency fields!");
              return;
            }

            await api.post("/mrfAgencySales", {
              agencyName: agencyForm.agencyName,
              material: agencyForm.material,
              weightKg: weight,
              ratePerKg: rate,
              totalAmount: weight * rate,
              dateSubmitted: formatDateTime(),
            });

            setAgencyForm({
              agencyName: "",
              material: "",
              weightKg: "",
              ratePerKg: "",
            });

            await loadAll();
            setShowAgency(false);
          } catch (err) {
            console.error("Agency sell error:", err);
            alert("❌ Agency Sell failed!");
          }
        }}
        extraActions={
          <button
            type="button"
            onClick={downloadAgencyPDF}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            PDF
          </button>
        }
      >
        <InputField
          label="Agency Name"
          value={agencyForm.agencyName}
          onChange={(v) => setAgencyForm((p) => ({ ...p, agencyName: v }))}
        />

        <SelectField
          label="Material"
          value={agencyForm.material}
          onChange={(v) => setAgencyForm((p) => ({ ...p, material: v }))}
          options={["Plastic", "Paper", "Metal", "Glass"]}
        />

        <InputField
          label="Weight (KG)"
          type="number"
          value={agencyForm.weightKg}
          onChange={(v) => setAgencyForm((p) => ({ ...p, weightKg: v }))}
          min={0}
        />

        <InputField
          label="Rate (₹/KG)"
          type="number"
          value={agencyForm.ratePerKg}
          onChange={(v) => setAgencyForm((p) => ({ ...p, ratePerKg: v }))}
          min={0}
        />

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 font-semibold text-gray-800 flex items-center gap-2">
          <BadgeIndianRupee className="h-5 w-5 text-green-700" />
          Total: ₹
          {Number(agencyForm.weightKg || 0) * Number(agencyForm.ratePerKg || 0)}
        </div>
      </FormModal>
    </div>
  );
}

export default WealthCenter;
