// @ts-nocheck
// src/pages/citizen/ComplaintsPage.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, RotateCcw } from "lucide-react";
import Webcam from "react-webcam";
import api from "../../api/api"; // <-- Axios instance

export default function ComplaintsPage() {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [complaintFormData, setComplaintFormData] = useState({
    citizenName: "",
    phoneNumber: "",
    wardNumber: "",
    area: "",
    category: "",
    description: "",
    photo: null,
  });

  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 480,
    height: 360,
    facingMode: "user",
  };

  const CATEGORIES = [
    "Illegal Dumping of C & D Waste",
    "Dead Animals",
    "Practice of Manual Scavenging",
    "Open Defecation",
    "Urination in Public",
    "No Electricity in Public Toilet",
    "Stagnant Water on the Road",
    "Sewerage or Storm Water Overflow",
    "Open Manholes or Drains",
    "Improper Disposal of Faecal Waste or Septage",
    "Cleaning of Sewer",
    "Public Toilet Blockage",
    "Public Toilet Cleaning",
    "Cleaning of Drain",
    "No Water Supply in Public Toilet",
    "Garbage Dump",
    "Dustbins Not Cleaned",
    "Sweeping Not Done",
    "Burning Of Garbage In Open Space",
    "Garbage Vehicle Not Arrived",
    "Cleaning of Garbage from Public Spaces",
    "Cleaning of Street Roads",
    "Door To Door Collection Not Done",
  ];

  // Load existing complaints from db.json via json-server
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const res = await api.get("/complaints");
        setComplaints(res.data);
      } catch (err) {
        console.error("Error loading complaints", err);
      }
    };
    loadComplaints();
  }, []);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedPhoto(imageSrc);
      setComplaintFormData((prev) => ({ ...prev, photo: imageSrc }));
    }
  }, []);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();

      // Map to db.json complaint shape
      const payload = {
        title: complaintFormData.category || "Citizen Complaint",
        citizenName: complaintFormData.citizenName,
        citizenPhone: complaintFormData.phoneNumber,
        ward: `Ward ${complaintFormData.wardNumber}`,
        location: complaintFormData.area,
        category: complaintFormData.category,
        description: complaintFormData.description,
        status: "pending",
        priority: "medium",
        createdAt: now,
        updatedAt: now,
        assignedTo: "Not assigned",
        resolvedDate: null,
        notes: "",
        photo: complaintFormData.photo, // base64 from webcam
      };

      const res = await api.post("/complaints", payload, {
        headers: { "Content-Type": "application/json" },
      }); // [web:53][web:50]

      // res.data is the saved complaint with generated id
      setComplaints((prev) => [res.data, ...prev]);
      resetForm();
      setShowComplaintForm(false);
    } catch (err) {
      console.error("Error submitting complaint", err);
      alert("Failed to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setComplaintFormData({
      citizenName: "",
      phoneNumber: "",
      wardNumber: "",
      area: "",
      category: "",
      description: "",
      photo: null,
    });
    setCapturedPhoto(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Started":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "In Progress":
      case "in-progress":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Done":
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysOpen = (dateSubmittedISO) => {
    const submitted = new Date(dateSubmittedISO);
    const now = new Date();
    const diffTime = Math.max(0, now - submitted);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      <main className="container mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top green banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight select-none">
                  Welcome to the Citizen Dashboard
                </h2>
                <p className="text-green-200 mt-3 max-w-3xl">
                  Monitor complaints and help keep our city clean. Capture and
                  submit issues in real time!
                </p>
              </div>
              <button
                onClick={() => setShowComplaintForm(true)}
                className="mt-6 md:mt-0 bg-white text-green-700 hover:bg-green-50 font-semibold py-4 px-8 rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
                aria-label="Post a new complaint"
              >
                <Camera className="h-6 w-6" />
                Post a Complaint
              </button>
            </div>
          </div>

          {/* Complaint list / empty state */}
          <div className="p-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-wide">
              Complaint Summary
            </h3>
            {complaints.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
                <Camera className="h-14 w-14 text-green-600 mx-auto mb-5" />
                <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                  No complaints submitted yet
                </h4>
                <p className="text-gray-600 max-w-lg mx-auto text-lg">
                  Capture an image and post your first complaint to help keep
                  the environment clean.
                </p>
              </div>
            ) : (
              <div className="grid gap-7">
                {complaints.map((complaint) => {
                  const daysOpen = getDaysOpen(complaint.createdAt);
                  const statusColor = getStatusColor(complaint.status);

                  return (
                    <div
                      key={complaint.id}
                      className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-7 shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            {complaint.citizenName}
                            {complaint.id && (
                              <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full select-none">
                                #{String(complaint.id).slice(-6)}
                              </span>
                            )}
                          </h4>
                          <p className="text-md text-gray-700 mt-1 font-medium">
                            {complaint.citizenPhone || complaint.phoneNumber} |{" "}
                            {complaint.location || complaint.area},{" "}
                            {complaint.ward || `Ward ${complaint.wardNumber}`}
                          </p>
                          <p className="text-md text-gray-700 mt-1 font-medium">
                            {complaint.category} |{" "}
                            {complaint.createdAt &&
                              new Date(complaint.createdAt).toLocaleString(
                                "en-IN"
                              )}
                          </p>
                          <p className="text-gray-800 mt-5 leading-relaxed">
                            {complaint.description}
                          </p>

                          <div
                            className={`mt-3 inline-block px-10 py-2 rounded-full text-lg font-medium border ${statusColor}`}
                          >
                            {complaint.status}
                          </div>

                          <div className="mt-2 text-sm text-gray-600">
                            Days Open:{" "}
                            <strong>
                              {daysOpen} day{daysOpen !== 1 ? "s" : ""}
                            </strong>
                          </div>
                        </div>
                        {complaint.photo && (
                          <img
                            src={complaint.photo}
                            alt="Complaint Evidence"
                            className="w-44 h-36 object-cover rounded-xl border border-gray-300 shadow-sm"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal complaint form */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 flex items-center justify-between rounded-t-3xl shadow-md">
              <h3 className="text-3xl font-bold">Post a New Complaint</h3>
              <button
                onClick={() => {
                  setShowComplaintForm(false);
                  resetForm();
                }}
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200"
                aria-label="Close complaint form"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="p-8 space-y-7">
              {/* Full Name */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="citizenName"
                  value={complaintFormData.citizenName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                  placeholder="Enter your name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={complaintFormData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Ward + Area */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-md font-semibold text-gray-800 mb-2">
                    Ward Number *
                  </label>
                  <input
                    type="text"
                    name="wardNumber"
                    value={complaintFormData.wardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                    placeholder="Enter ward number"
                  />
                </div>
                <div>
                  <label className="block text-md font-semibold text-gray-800 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={complaintFormData.area}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                    placeholder="Enter area/locality"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={complaintFormData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={complaintFormData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 resize-none focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              {/* Camera / Capture area */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center shadow-inner bg-gray-50">
                {!capturedPhoto ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="rounded-2xl mx-auto mb-6 shadow-lg"
                      mirrored
                    />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-800 transition-transform duration-300 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
                    >
                      <Camera className="h-6 w-6" />
                      Capture Photo
                    </button>
                  </>
                ) : (
                  <div>
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="max-h-64 rounded-2xl mx-auto mb-4 shadow-md border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedPhoto(null);
                        setComplaintFormData((prev) => ({
                          ...prev,
                          photo: null,
                        }));
                      }}
                      className="px-5 py-2 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl mx-auto transition-transform duration-300 hover:scale-110 shadow-sm"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Retake
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowComplaintForm(false);
                    resetForm();
                  }}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 font-semibold transition-colors duration-300 shadow-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-800 transition-transform duration-300 hover:scale-105 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-300 mt-12 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600 select-none">
          © {new Date().getFullYear()} Solid Waste Management System. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
