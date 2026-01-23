// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

import DefectHeader from "./components/DefectHeader";
import DefectStats from "./components/DefectStats";
import DefectFilters from "./components/DefectFilters";
import DefectList from "./components/DefectList";
import DefectModal from "./components/DefectModal";

import {
  MACHINE_CATEGORIES,
  validateMachineryForm,
  getNextStatus,
} from "./utils/defectHelpers";

export default function MachineryDefect() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const [recordFormData, setRecordFormData] = useState({
    supervisorName: "",
    contactNumber: "",
    machineType: "",
    description: "",
    photo: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const webcamRef = useRef(null);

  /* ================= API ================= */

  const fetchDefects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/machinery-defects/all-machinery-defects");
      setRecords(res.data?.data || []);
    } catch (error) {
      console.log("Fetch error:", error);
      setRecords([]);
      toast.error("Failed to load defects ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDefects();
  }, [fetchDefects]);

  /* ================= PHOTO ================= */

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setRecordFormData((prev) => ({ ...prev, photo: imageSrc }));
      setIsCameraActive(false);
    } else {
      toast.warning("Camera capture failed ❗");
    }
  }, []);

  const handleRetake = () => {
    setRecordFormData((prev) => ({ ...prev, photo: null }));
    setIsCameraActive(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmitRecord = async (e) => {
    e.preventDefault();

    const errors = validateMachineryForm(recordFormData);
    setFormErrors(errors);

    if (Object.keys(errors).length !== 0) {
      toast.warning("Please fill all required fields ❗");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("supervisorName", recordFormData.supervisorName);
      fd.append("contactNumber", recordFormData.contactNumber);
      fd.append("machineType", recordFormData.machineType);
      fd.append("description", recordFormData.description);
      fd.append("status", "started");

      const blob = await (await fetch(recordFormData.photo)).blob();
      const file = new File([blob], `machinery-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      fd.append("image", file);

      await api.post("/machinery-defects/create-machinery-defect", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Defect submitted successfully ✅");

      setShowRecordForm(false);
      setIsCameraActive(true);
      setRecordFormData({
        supervisorName: "",
        contactNumber: "",
        machineType: "",
        description: "",
        photo: null,
      });

      await fetchDefects();
    } catch (error) {
      console.log("POST ERROR:", error);
      toast.error(error?.response?.data?.message || "Submit failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const handleUpdateStatus = async (record) => {
    try {
      if (!record?._id) {
        toast.warning("Record id missing ❗");
        return;
      }

      setUpdatingId(record._id);

      const nextStatus = getNextStatus(record.status);

      const fd = new FormData();
      fd.append("status", nextStatus);

      await api.put(
        `/machinery-defects/update-machinery-defect/${record._id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Status updated ✅");
      await fetchDefects();
    } catch (error) {
      console.log("UPDATE STATUS ERROR:", error);
      toast.error("Update failed ❌");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= Filter Records ================= */

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.supervisorName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.machineType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const totalRecords = filteredRecords.length;
  const startedRecords = filteredRecords.filter((r) => r.status === "started").length;
  const inProgressRecords = filteredRecords.filter((r) => r.status === "inprogress").length;
  const repairedRecords = filteredRecords.filter((r) => r.status === "repaired").length;

  return (
    <div className="h-full">
      <DefectHeader
        onAdd={() => {
          setShowRecordForm(true);
          setIsCameraActive(true);
          setRecordFormData({
            supervisorName: "",
            contactNumber: "",
            machineType: "",
            description: "",
            photo: null,
          });
          setFormErrors({});
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <DefectStats
          totalRecords={totalRecords}
          startedRecords={startedRecords}
          inProgressRecords={inProgressRecords}
          repairedRecords={repairedRecords}
        />

        <DefectFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <DefectList
          loading={loading}
          records={filteredRecords}
          updatingId={updatingId}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      <DefectModal
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSubmit={handleSubmitRecord}
        submitting={submitting}
        recordFormData={recordFormData}
        setRecordFormData={setRecordFormData}
        formErrors={formErrors}
        capturePhoto={capturePhoto}
        handleRetake={handleRetake}
        webcamRef={webcamRef}
        isCameraActive={isCameraActive}
        MACHINE_CATEGORIES={MACHINE_CATEGORIES}
      />
    </div>
  );
}
