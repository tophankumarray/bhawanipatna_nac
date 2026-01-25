// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api/api";

import { ALLOWED_VEHICLES } from "./vehiclesConfig";
import { normalizeVehicles } from "./utils/normalizeVehicles";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const res = await api.get("/tracking/trackings");
      const list = res?.data?.data?.list || [];

      if (!Array.isArray(list)) {
        toast.error("Tracking list is not array ❌");
        setVehicles([]);
        return;
      }

      const normalized = normalizeVehicles(list);

      const allowed = normalized.filter((v) =>
        ALLOWED_VEHICLES.has(v.registrationNumber)
      );

      setVehicles(allowed);
    } catch (err) {
      console.error("Vehicles load error:", err);
      toast.error("Failed to load vehicles ❌");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return vehicles;

    return vehicles.filter((v) => {
      return (
        v.registrationNumber?.toLowerCase().includes(q) ||
        v.assignedWard?.toLowerCase().includes(q)
      );
    });
  }, [vehicles, search]);

  // ✅ card counts (UI same)
  const total = filteredVehicles.length;
  const active = filteredVehicles.filter((v) => v.status === "running").length;
  const inactive = filteredVehicles.filter((v) => v.status === "stopped").length;
  const maintenance = filteredVehicles.filter((v) => v.status === "standing").length;

  return {
    loading,
    search,
    setSearch,
    filteredVehicles,
    counts: { total, active, inactive, maintenance },
    reload: loadVehicles,
  };
};
