// @ts-nocheck
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { Map, Navigation, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";

/* ================= MAP CENTER ================= */
const center = { lat: 19.3149, lng: 84.7941 };

/* ================= STATUS COLOR ================= */
const getColor = (status) => {
  if (status === "Active") return "#22c55e";
  if (status === "Maintenance") return "#facc15";
  return "#ef4444";
};

/* ================= BEARING CALCULATION ================= */
const getBearing = (from, to) => {
  const lat1 = (from.lat * Math.PI) / 180;
  const lon1 = (from.lng * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lon2 = (to.lng * Math.PI) / 180;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

/* ================= COMPONENT ================= */
const LiveTracking = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const location = useLocation();
  const focusedVehicleNo = location.state?.vehicleNo;

  const mapRef = useRef(null);
  const blinkRef = useRef(true);

  const [mapType, setMapType] = useState("roadmap");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  /* ================= LOAD VEHICLES (AXIOS + WARD FILTER) ================= */
  useEffect(() => {
    const loadVehicles = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const supervisorWard = user?.ward;

      const res = await api.get("/vehicles");

      let data = res.data;

      // 3️⃣ Ward-only vehicles
      if (supervisorWard) {
        data = data.filter((v) => v.ward === supervisorWard);
      }

      const prepared = data.map((v) => ({
        id: v.id,
        number: v.number,
        driver: v.driver || "N/A",
        ward: v.ward,
        status: v.status,
        speed: v.status === "Active" ? 25 + Math.random() * 20 : 0, // 2️⃣ speed-based
        lastUpdated: new Date().toLocaleTimeString(),
        path: [
          {
            lat: center.lat + (Math.random() - 0.5) * 0.01,
            lng: center.lng + (Math.random() - 0.5) * 0.01,
          },
        ],
        rotation: 0,
      }));

      setVehicles(prepared);

      if (focusedVehicleNo) {
        const found = prepared.find(
          (v) => v.number === focusedVehicleNo
        );
        if (found) setSelectedVehicle(found);
      }
    };

    loadVehicles();
  }, [focusedVehicleNo]);

  /* ================= BLINK ANIMATION ================= */
  useEffect(() => {
    const blink = setInterval(() => {
      blinkRef.current = !blinkRef.current;
    }, 600);
    return () => clearInterval(blink);
  }, []);

  /* ================= LIVE GPS MOVEMENT ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          // 4️⃣ Pause when GPS offline / maintenance
          if (v.status !== "Active") return v;

          const last = v.path[v.path.length - 1];
          const step = v.speed / 100000; // realistic movement

          const next = {
            lat: last.lat + (Math.random() - 0.5) * step,
            lng: last.lng + (Math.random() - 0.5) * step,
          };

          return {
            ...v,
            rotation: getBearing(last, next), // 1️⃣ rotation
            lastUpdated: new Date().toLocaleTimeString(),
            path: [...v.path.slice(-30), next],
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    if (!selectedVehicle || !mapRef.current) return;
    const pos =
      selectedVehicle.path[selectedVehicle.path.length - 1];
    mapRef.current.panTo(pos);
    mapRef.current.setZoom(16);
  }, [selectedVehicle]);

  if (!isLoaded) return <p className="p-6">Loading Map…</p>;

  return (
    <div className="relative h-[75vh] bg-white rounded-2xl shadow overflow-hidden">

      {/* ================= MAP ================= */}
      <GoogleMap
        onLoad={(map) => (mapRef.current = map)}
        zoom={14}
        center={center}
        mapTypeId={mapType}
        mapContainerClassName="w-full h-full"
      >
        {vehicles.map((v) => {
          const showMarker =
            v.status !== "Active" || blinkRef.current;

          if (!showMarker) return null; // 5️⃣ blinking

          return (
            <div key={v.id}>
              <Polyline
                path={v.path}
                options={{
                  strokeColor: getColor(v.status),
                  strokeWeight: 4,
                }}
              />

              <Marker
                position={v.path[v.path.length - 1]}
                onClick={() => setSelectedVehicle(v)}
                icon={{
                  url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
                  scaledSize: new window.google.maps.Size(36, 36),
                  anchor: new window.google.maps.Point(18, 18),
                  rotation: v.rotation,
                }}
              />
            </div>
          );
        })}
      </GoogleMap>

      {/* ================= MAP CONTROLS ================= */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
        <button
          onClick={() =>
            setMapType(
              mapType === "roadmap" ? "satellite" : "roadmap"
            )
          }
          className="bg-white shadow p-2 rounded-lg"
        >
          <Map size={18} />
        </button>

        <button
          onClick={() => {
            mapRef.current.panTo(center);
            mapRef.current.setZoom(14);
          }}
          className="bg-white shadow p-2 rounded-lg"
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* ================= VEHICLE PANEL ================= */}
      {selectedVehicle && (
        <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-green-700">
              Vehicle Details
            </h2>
            <button onClick={() => setSelectedVehicle(null)}>
              <X />
            </button>
          </div>

          <div className="p-4 space-y-3 text-sm">
            <Info label="Vehicle No" value={selectedVehicle.number} />
            <Info label="Driver" value={selectedVehicle.driver} />
            <Info label="Ward" value={selectedVehicle.ward} />
            <Info label="Speed" value={`${selectedVehicle.speed.toFixed(1)} km/h`} />
            <Info label="Status" value={selectedVehicle.status} badge />
            <Info
              label="Last GPS Update"
              value={selectedVehicle.lastUpdated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= INFO ROW ================= */
const Info = ({ label, value, badge }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    {badge ? (
      <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-green-600 text-white">
        {value}
      </span>
    ) : (
      <p className="font-medium">{value}</p>
    )}
  </div>
);

export default LiveTracking;
