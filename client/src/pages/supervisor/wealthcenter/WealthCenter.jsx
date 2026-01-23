// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Cuboid,
  Plus,
  RotateCcw,
  BadgeIndianRupee,
  Shield,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* ✅ APIs */
import api from "../../../api/api"; // backend axios (5900)
import api2 from "../../../api/mockAPI"; // json-server axios (3000)

/* ✅ PDF */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ✅ Components */
import WealthHeader from "./components/WealthHeader";
import SearchFilterBar from "./components/SearchFilterBar";
import RecordsList from "./components/RecordsList";
import FormModal from "./components/FormModal";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import CameraField from "./components/CameraField";

/* ✅ Config + Helpers */
import {
  MCC_CUBES,
  MRF_CUBES,
  AGENCY_MATERIALS,
} from "./config/wealthCenterConfig";
import {
  formatDateTime,
  validatePhone,
  canSubmitRecord,
} from "./utils/wealthCenterHelpers";

function WealthCenter() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [activeTab, setActiveTab] = useState("MCC");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showAgency, setShowAgency] = useState(false);

  const [mccRecords, setMccRecords] = useState([]);
  const [mrfRecords, setMrfRecords] = useState([]);
  const [agencySales, setAgencySales] = useState([]);

  const [loading, setLoading] = useState(false);

  const [recordFormData, setRecordFormData] = useState({
    wealthCenter: "Buguda NAC",
    supervisorName: "",
    phoneNo: "",
    cubeNumber: "",
    photo: null,
  });

  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    material: "",
    weightKg: "",
    ratePerKg: "",
  });

  /* ================= Load Data ================= */

  const loadAll = async () => {
    try {
      setLoading(true);

      const [mccRes, mrfRes, salesRes] = await Promise.all([
        api.get("/mcc/all-mcc-records"),
        api.get("/mrf/all-mrf-records"),
        api2.get("/mrfAgencySales"),
      ]);

      setMccRecords(mccRes.data?.data || []);
      setMrfRecords(mrfRes.data?.data || []);
      setAgencySales(salesRes.data || []);
    } catch (err) {
      console.error("WealthCenter load error:", err);
      toast.error("Failed to load records. Check backend + json-server.");
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

  /* ================= Photo ================= */

  const capturePhoto = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setRecordFormData((p) => ({ ...p, photo: img }));
  };

  const retakePhoto = () => {
    setRecordFormData((p) => ({ ...p, photo: null }));
  };

  /* ================= Submit MCC/MRF Record ================= */

  const handleSubmitRecord = async (e) => {
    e.preventDefault();

    if (!canSubmitRecord(recordFormData)) {
      toast.warning("Fill all fields and capture image!");
      return;
    }

    try {
      const fd = new FormData();

      fd.append("wealthCenter", recordFormData.wealthCenter);
      fd.append("supervisorName", recordFormData.supervisorName);

      // backend expects contactNumber
      fd.append("contactNumber", recordFormData.phoneNo);

      fd.append("cubeNumber", String(recordFormData.cubeNumber));
      fd.append("status", "Stored");
      fd.append("dateSubmitted", formatDateTime());

      // base64 -> file
      const blob = await (await fetch(recordFormData.photo)).blob();
      const file = new File([blob], `record-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      // multer expects "image"
      fd.append("image", file);

      if (activeTab === "MCC") {
        await api.post("/mcc/create-mcc-record", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/mrf/create-mrf-record", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(`${activeTab} record submitted successfully ✅`);

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
      toast.error(err?.response?.data?.message || "Submit failed!");
    }
  };

  /* ================= Agency Submit (json-server) ================= */

  const handleSubmitAgency = async (e) => {
    e.preventDefault();

    try {
      const weight = Number(agencyForm.weightKg);
      const rate = Number(agencyForm.ratePerKg);

      if (!agencyForm.agencyName.trim()) {
        toast.warning("Agency name is required!");
        return;
      }
      if (!agencyForm.material) {
        toast.warning("Select material!");
        return;
      }
      if (!weight || weight <= 0) {
        toast.warning("Enter valid weight!");
        return;
      }
      if (!rate || rate <= 0) {
        toast.warning("Enter valid rate!");
        return;
      }

      const payload = {
        agencyName: agencyForm.agencyName,
        material: agencyForm.material,
        weightKg: weight,
        ratePerKg: rate,
        totalAmount: weight * rate,
        dateSubmitted: formatDateTime(),
      };

      await api2.post("/mrfAgencySales", payload);

      toast.success("Agency Sale stored successfully ✅");

      setAgencyForm({
        agencyName: "",
        material: "",
        weightKg: "",
        ratePerKg: "",
      });

      const salesRes = await api2.get("/mrfAgencySales");
      setAgencySales(salesRes.data || []);

      setShowAgency(false);
    } catch (err) {
      console.error("Agency submit error:", err);
      toast.error("Failed to store Agency Sale ❌");
    }
  };

  /* ================= Reset ================= */

  const resetAll = async () => {
    toast.info("Reset API not implemented yet.");
  };

  /* ================= Filtered Records ================= */

  const currentRecords = activeTab === "MCC" ? mccRecords : mrfRecords;

  const filteredRecords = useMemo(() => {
    return (currentRecords || []).filter((r) => {
      const matchesSearch =
        r.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r._id || r.id || "").includes(searchTerm) ||
        String(r.cubeNumber).includes(searchTerm);

      const matchesStatus = statusFilter === "All" || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [currentRecords, searchTerm, statusFilter]);

  /* ================= PDF DOWNLOAD (AGENCY SALES) ================= */

  const downloadAgencyPDF = () => {
    if (!agencySales || agencySales.length === 0) {
      toast.info("No Agency Sales records found!");
      return;
    }

    const doc = new jsPDF("portrait");

    doc.setFontSize(16);
    doc.text("MRF Agency Sales Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 23);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Agency", "Material", "Weight(KG)", "Rate(₹)", "Total(₹)", "Date"]],
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
    });

    doc.save(`agency-sales-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <WealthHeader />

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
            <Cuboid className="h-5 w-5" /> MCC
          </button>

          <button
            onClick={() => setActiveTab("MRF")}
            className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === "MRF"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Cuboid className="h-5 w-5" /> MRF
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
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Records */}
        <RecordsList loading={loading} records={filteredRecords} activeTab={activeTab} />
      </div>

      {/* Add Record Modal */}
      <FormModal
        title={`${activeTab} Add Record`}
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSubmit={handleSubmitRecord}
      >
        <InputField label="Wealth Center" value={recordFormData.wealthCenter} readOnly />

        <InputField
          label="Supervisor Name"
          value={recordFormData.supervisorName}
          onChange={(v) => setRecordFormData((p) => ({ ...p, supervisorName: v }))}
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
          onRetake={retakePhoto}
          webcamRef={webcamRef}
        />

        {!canSubmitRecord(recordFormData) && (
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
        onSubmit={handleSubmitAgency}
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
          options={AGENCY_MATERIALS}
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
          Total: ₹ {Number(agencyForm.weightKg || 0) * Number(agencyForm.ratePerKg || 0)}
        </div>
      </FormModal>
    </div>
  );
}

export default WealthCenter;
