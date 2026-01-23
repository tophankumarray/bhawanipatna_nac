// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// import api from "../../../../api/api";

import { ALLOWED_VEHICLES } from "./vehiclesConfig";
import { normalizeVehicles } from "./utils/normalizeVehicles";
import { downloadVehiclesExcel, downloadVehiclesPDF } from "./utils/exportVehicles";

import VehiclesHeader from "./components/VehiclesHeader";
import VehiclesSearchBar from "./components/VehiclesSearchBar";
import VehicleGrid from "./components/VehicleGrid";
import VehicleDetailsModal from "./components/VehicleDetailsModal";
import MapModal from "./components/MapModal";
import api from "../../../api/api";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapVehicle, setMapVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

        const normalizedVehicles = normalizeVehicles(list);

        const filteredByAllowed = normalizedVehicles.filter((v) =>
          ALLOWED_VEHICLES.has(v.registrationNumber)
        );

        setVehicles(filteredByAllowed);

        if (filteredByAllowed.length === 0) {
          toast.info("No matching vehicles found ❌");
        }
      } catch (err) {
        console.error("Failed to load vehicles:", err);
        toast.error("Failed to load vehicles ❌");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const q = search.toLowerCase();
    return vehicles.filter((v) => {
      return (
        v.registrationNumber?.toLowerCase().includes(q) ||
        v.assignedWard?.toLowerCase().includes(q) ||
        v.driver?.toLowerCase().includes(q)
      );
    });
  }, [vehicles, search]);

  const handleDownloadPDF = () => {
    if (!vehicles.length) return toast.info("No vehicle data found!");
    downloadVehiclesPDF(vehicles);
  };

  const handleDownloadExcel = () => {
    if (!vehicles.length) return toast.info("No vehicle data found!");
    downloadVehiclesExcel(vehicles);
  };

  return (
    <div className="space-y-8">
      <VehiclesHeader
        onDownloadPDF={handleDownloadPDF}
        onDownloadExcel={handleDownloadExcel}
      />

      <VehiclesSearchBar value={search} onChange={setSearch} />

      {loading && (
        <div className="text-sm text-gray-600 font-semibold">
          Loading vehicles...
        </div>
      )}

      {!loading && filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-center text-gray-500">
          No vehicles found
        </div>
      ) : (
        <VehicleGrid
          vehicles={filteredVehicles}
          onOpenDetails={setSelectedVehicle}
          onOpenMap={setMapVehicle}
        />
      )}

      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {mapVehicle && (
        <MapModal vehicle={mapVehicle} onClose={() => setMapVehicle(null)} />
      )}
    </div>
  );
};

export default Vehicles;
