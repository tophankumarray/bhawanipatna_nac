// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchTrackings } from "../../../api/admin/trackVehicle.api";
import { ALLOWED_VEHICLES } from "./utils/trackVehicle.utils";

export const useTrackVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    ward: "all",
    search: "",
  });

  const fetchVehicleLocations = async () => {
    try {
      setLoading(true);
      const response = await fetchTrackings();
      const list = response.data?.data?.list || [];

      const normalizedVehicles = list
        .filter(item => ALLOWED_VEHICLES.includes(item.truck_number))
        .map(item => {
          let status = "stopped";

          if (item.lat == null || item.lng == null) {
            status = "dataNotRetrieving";
          } else if (item.speed > 0) {
            status = "running";
          } else {
            status = "standing";
          }

          return {
            id: item.imei,
            registrationNumber: item.truck_number,
            status,
            assignedWard: item.address || "N/A",
            speed: item.speed ?? null,
            location: {
              lat: Number(item.lat),
              lng: Number(item.lng),
            },
            signalStrength: item.signal_strength ?? null,
            ignitionOn: item.is_ignition_on?.value ?? false,
            lastUpdated: new Date(item.device_timestamp),
            type: "compactor",
            routeProgress: Math.floor(Math.random() * 100),
          };
        });

      setVehicles(normalizedVehicles);
    } catch (error) {
      toast.error("Failed to fetch vehicle locations");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleLocations();
    const interval = setInterval(fetchVehicleLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = filters.status === "all" || vehicle.status === filters.status;
    const matchesWard = filters.ward === "all" || vehicle.assignedWard === filters.ward;
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesWard && matchesSearch;
  });

  const uniqueWards = [...new Set(vehicles.map(v => v.assignedWard))].sort();

  return {
    vehicles,
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
    loading,
    filters,
    setFilters,
    uniqueWards,
  };
};
