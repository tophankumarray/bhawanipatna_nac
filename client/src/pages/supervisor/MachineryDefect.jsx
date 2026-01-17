import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  TrendingUp,
  Wrench,
  Plus,
  ArrowRight,
  Zap,
  Shield,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Webcam from "react-webcam";
import api from "../../api/api";

/* ================= Reusable Components ================= */

const FormModal = ({ title, children, isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 flex justify-between items-center rounded-t-3xl shadow-lg">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          {children}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg flex items-center gap-2"
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
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 font-medium ${
        readOnly
          ? "bg-gray-100 border-gray-300 cursor-not-allowed"
          : error
          ? "bg-white border-red-500 focus:ring-2 focus:ring-red-500"
          : "bg-white border-gray-300 focus:ring-2 focus:ring-emerald-500 hover:border-gray-400"
      }`}
      required={required && !readOnly}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options, required = true }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 font-medium"
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

const TextareaField = ({ label, value, onChange, required = true }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows="4"
      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 font-medium resize-none"
      required={required}
    />
  </div>
);

const CameraField = ({ photo, onCapture, onRetake, webcamRef, isCameraActive }) => (
  <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
    {!photo ? (
      isCameraActive ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 400, height: 300, facingMode: "user" }}
          className="rounded-xl w-full mb-4 shadow-md mx-auto"
        />
      ) : null
    ) : (
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700 mb-3">Captured Image:</p>
        <img
          src={photo}
          alt="Captured evidence"
          className="rounded-xl max-h-40 mx-auto shadow-md border-2 border-emerald-200 object-contain"
        />
      </div>
    )}

    <div className="flex justify-center mt-4">
      {!photo ? (
        <button
          type="button"
          onClick={onCapture}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          <Camera className="h-5 w-5" />
          Capture Image
        </button>
      ) : (
        <button
          type="button"
          onClick={onRetake}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold"
        >
          <RotateCcw className="h-5 w-5" />
          Retake
        </button>
      )}
    </div>
  </div>
);

/* ================= Main Component ================= */

export default function MachineryDefect() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const [recordFormData, setRecordFormData] = useState({
    supervisorName: "",
    phoneNo: "",
    machineName: "",
    description: "",
    photo: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 update button loading per id
  const [updatingId, setUpdatingId] = useState(null);

  const webcamRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  const MACHINE_CATEGORIES = [
    "Sheaving/Screening Machine",
    "Balling Machine",
    "Incinerator",
    "Grass Cutter",
    "Tree Cutter",
    "Grease Gun",
    "Shredder Machine",
  ];

  /* ================= API ================= */

  const fetchMachineryComplaints = useCallback(async () => {
    try {
      setLoading(true);

      const phone = user?.phoneNo || user?.mobile || "";
      const url = phone
        ? `/machineryComplaints?phoneNo=${phone}`
        : `/machineryComplaints`;

      const res = await api.get(url);
      setRecords(res.data || []);
    } catch (error) {
      console.log("Fetch error:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMachineryComplaints();
  }, [fetchMachineryComplaints]);

  /* ================= FORM VALIDATION ================= */

  const validateForm = () => {
    const errors = {};
    if (!/^\d{10}$/.test(recordFormData.phoneNo)) {
      errors.phoneNo = "Contact number must be exactly 10 digits.";
    }
    if (!recordFormData.supervisorName) errors.supervisorName = "Required";
    if (!recordFormData.machineName) errors.machineName = "Required";
    if (!recordFormData.description) errors.description = "Required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= PHOTO ================= */

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setRecordFormData((prev) => ({ ...prev, photo: imageSrc }));
      setIsCameraActive(false);
    }
  }, []);

  const handleRetake = () => {
    setRecordFormData((prev) => ({ ...prev, photo: null }));
    setIsCameraActive(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmitRecord = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const newRecord = {
        supervisorName: recordFormData.supervisorName,
        phoneNo: recordFormData.phoneNo,
        machineName: recordFormData.machineName,
        description: recordFormData.description,
        photo: recordFormData.photo || "",
        status: "Started",
        dateSubmitted: new Date().toLocaleString(),
      };

      await api.post("/machineryComplaints", newRecord);

      await fetchMachineryComplaints();

      setShowRecordForm(false);
      setIsCameraActive(true);
      setRecordFormData({
        supervisorName: "",
        phoneNo: "",
        machineName: "",
        description: "",
        photo: null,
      });
    } catch (error) {
      console.log("POST ERROR:", error);
      alert("Submit failed! Check console.");
    }
  };

  /* ================= UPDATE STATUS (WORKING) ================= */

  const getNextStatus = (current) => {
    if (current === "Started") return "In Progress";
    if (current === "In Progress") return "Done";
    return "Done";
  };

  const handleUpdateStatus = async (record) => {
    try {
      if (!record?.id) {
        alert("Record id missing!");
        return;
      }

      setUpdatingId(record.id);

      const nextStatus = getNextStatus(record.status);

      await api.patch(`/machineryComplaints/${record.id}`, {
        status: nextStatus,
      });

      await fetchMachineryComplaints();
    } catch (error) {
      console.log("UPDATE STATUS ERROR:", error);
      alert("Update failed! Check console.");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= Filter Records ================= */

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id?.toString().includes(searchTerm) ||
        record.machineName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const totalRecords = filteredRecords.length;
  const pendingRecords = filteredRecords.filter((r) => r.status === "Started").length;
  const inProgressRecords = filteredRecords.filter((r) => r.status === "In Progress").length;
  const resolvedRecords = filteredRecords.filter((r) => r.status === "Done").length;

  if (loading && records.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading defects...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="max-w-7xl bg-gradient-to-r mx-auto px-7 rounded-lg from-emerald-600 to-teal-600 text-white py-8 shadow-2xl mt-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-3 rounded-xl">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold">Machinery Defect Tracker</h1>
        </div>
        <p className="text-emerald-100 text-lg ml-16">
          Monitor, track, and resolve equipment issues in real-time
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-7 text-white">
            <p className="text-blue-100 text-sm font-semibold mb-2">Total Defects</p>
            <p className="text-5xl font-black">{totalRecords}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-7 text-white">
            <p className="text-yellow-100 text-sm font-semibold mb-2">Started</p>
            <p className="text-5xl font-black">{pendingRecords}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-7 text-white">
            <p className="text-indigo-100 text-sm font-semibold mb-2">In Progress</p>
            <p className="text-5xl font-black">{inProgressRecords}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-7 text-white">
            <p className="text-emerald-100 text-sm font-semibold mb-2">Resolved</p>
            <p className="text-5xl font-black">{resolvedRecords}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-7 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or machine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="relative w-full md:w-48">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-xl bg-white font-semibold text-gray-700"
              >
                <option value="All">All Status</option>
                <option value="Started">Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="space-y-6">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-20 text-center border border-gray-100">
              <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No Machinery Defects Found
              </h3>
            </div>
          ) : (
            filteredRecords.map((record, idx) => (
              <div
                key={record.id || idx}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800">
                        DEF-{record.id}
                      </h3>
                      <p className="text-gray-600 font-semibold">{record.machineName}</p>
                    </div>

                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        record.status === "Started"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          : record.status === "In Progress"
                          ? "bg-orange-100 text-orange-800 border border-orange-300"
                          : "bg-green-100 text-green-800 border border-green-300"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center space-x-4 bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
                        <User className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-bold">Supervisor</p>
                          <p className="font-bold text-gray-800">{record.supervisorName}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 bg-purple-50 p-5 rounded-xl border-2 border-purple-200">
                        <Phone className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-bold">Phone</p>
                          <p className="font-bold text-gray-800">{record.phoneNo}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 bg-orange-50 p-5 rounded-xl border-2 border-orange-200">
                        <Calendar className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-bold">Date</p>
                          <p className="font-bold text-gray-800">{record.dateSubmitted}</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex items-center justify-center">
                      {record.photo ? (
                        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg w-full h-40">
                          <img
                            src={record.photo}
                            alt="Defect"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-gray-400 italic text-sm w-full h-40 border-2 border-dashed border-gray-300 rounded-xl">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                    <p className="text-sm text-gray-700 font-bold mb-2">Description:</p>
                    <p className="text-gray-800">{record.description}</p>
                  </div>

                  {/* ✅ UPDATE STATUS BUTTON WORKING */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => handleUpdateStatus(record)}
                      disabled={record.status === "Done" || updatingId === record.id}
                      className={`px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all duration-200 ${
                        record.status === "Done"
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                      }`}
                    >
                      {updatingId === record.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : record.status === "Done" ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          Update Status <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          setShowRecordForm(true);
          setIsCameraActive(true);
          setRecordFormData({
            supervisorName: "",
            phoneNo: "",
            machineName: "",
            description: "",
            photo: null,
          });
        }}
        className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 fixed right-7 bottom-12"
      >
        <Plus className="h-5 w-5" />
        Add Defect
      </button>

      {/* Modal */}
      <FormModal
        title="Report Machinery Defect"
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSubmit={handleSubmitRecord}
      >
        <InputField
          label="Supervisor Name"
          value={recordFormData.supervisorName}
          onChange={(v) =>
            setRecordFormData({ ...recordFormData, supervisorName: v })
          }
        />

        <InputField
          label="Contact Number"
          type="tel"
          value={recordFormData.phoneNo}
          onChange={(v) => {
            const sanitized = v.replace(/\D/g, "").slice(0, 10);
            setRecordFormData({ ...recordFormData, phoneNo: sanitized });
          }}
          error={formErrors.phoneNo}
        />

        <SelectField
          label="Machine Name"
          value={recordFormData.machineName}
          onChange={(v) =>
            setRecordFormData({ ...recordFormData, machineName: v })
          }
          options={MACHINE_CATEGORIES}
        />

        <CameraField
          photo={recordFormData.photo}
          onCapture={() => {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
              setRecordFormData((prev) => ({ ...prev, photo: imageSrc }));
              setIsCameraActive(false);
            }
          }}
          onRetake={() => {
            setRecordFormData((prev) => ({ ...prev, photo: null }));
            setIsCameraActive(true);
          }}
          webcamRef={webcamRef}
          isCameraActive={isCameraActive}
        />

        <TextareaField
          label="Description"
          value={recordFormData.description}
          onChange={(v) =>
            setRecordFormData({ ...recordFormData, description: v })
          }
        />

        <div className="text-sm text-gray-700 bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
          <div className="flex gap-2 items-start">
            <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 mb-1">Auto-filled</p>
              <p>📅 Date & Time auto-added on submit</p>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
