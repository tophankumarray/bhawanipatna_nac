// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getAllFuelRecords,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
} from "../../../api/admin/fuelManagement.api";

import { mapFuelRecord } from "./utils/fuelMapper";
import { generateFuelPDF } from "./utils/fuelPdf";

const useFuelManagement = () => {
  /* ================= STATE ================= */
  const [fuelRecords, setFuelRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState({
    vehicle: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  const [formData, setFormData] = useState({
    vehicle: "",
    driver: "",
    refuelDate: "",
    fuelType: "diesel",
    quantity: "",
    pricePerLiter: "",
    odometer: "",
    efficiency: "",
    fillingStation: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchFuelRecords();
  }, []);

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      const res = await getAllFuelRecords();
      setFuelRecords(res.data.data.map(mapFuelRecord));
    } catch (err) {
      console.warn("API error", err);
      setFuelRecords([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MODAL ================= */
  const openModal = () => {
    setEditMode(false);
    setSelectedRecord(null);
    setFormData({
      vehicle: "",
      driver: "",
      refuelDate: "",
      fuelType: "diesel",
      quantity: "",
      pricePerLiter: "",
      odometer: "",
      efficiency: "",
      fillingStation: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedRecord(null);
  };

  /* ================= FORM ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      vehicleNumber: formData.vehicle,
      driverName: formData.driver,
      date: formData.refuelDate,
      fuelType:
        formData.fuelType === "diesel"
          ? "Diesel"
          : formData.fuelType === "petrol"
          ? "Petrol"
          : "CNG",
      quantityLiters: Number(formData.quantity),
      pricePerLiter: Number(formData.pricePerLiter),
      odometerReading: Number(formData.odometer),
      efficiency: Number(formData.efficiency) || 0,
      fillingStation: formData.fillingStation,
    };

    try {
      if (editMode && selectedRecord) {
        const res = await updateFuelRecord(selectedRecord._id, payload);
        const updated = mapFuelRecord(res.data.data);

        setFuelRecords((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );

        toast.success("Fuel record updated successfully!");
      } else {
        const res = await createFuelRecord(payload);
        setFuelRecords((prev) => [...prev, mapFuelRecord(res.data.data)]);
        toast.success("Fuel record added successfully!");
      }

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(
        editMode
          ? "Failed to update fuel record"
          : "Failed to add fuel record"
      );
    }
  };

  /* ================= EDIT / DELETE ================= */
  const handleEdit = (record) => {
    setEditMode(true);
    setSelectedRecord(record);
    setFormData({
      vehicle: record.vehicle,
      driver: record.driver,
      refuelDate: record.refuelDate,
      fuelType: record.fuelType,
      quantity: record.quantity,
      pricePerLiter: record.pricePerLiter,
      odometer: record.odometer,
      efficiency: record.efficiency || "",
      fillingStation: record.fillingStation,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fuel record?"))
      return;

    try {
      await deleteFuelRecord(id);
      setFuelRecords((prev) => prev.filter((r) => r._id !== id));
      toast.success("Fuel record deleted successfully!");
    } catch {
      toast.error("Failed to delete fuel record");
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

  const getUniqueVehicles = () =>
    [...new Set(fuelRecords.map((r) => r.vehicle))].sort();

  /* ================= PDF ================= */
  const downloadPDF = () =>
    generateFuelPDF(filteredRecords, stats);

  return {
    fuelRecords,
    filteredRecords,
    loading,
    filters,
    setFilters,
    formData,
    showModal,
    editMode,
    stats,
    getUniqueVehicles,
    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    downloadPDF,
  };
};

export default useFuelManagement;
