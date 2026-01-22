// @ts-nocheck
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api/api";

/* ===============================
   FIX LEAFLET ICON ISSUE
================================ */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ===============================
   CATEGORY CONFIG
================================ */
const categoryConfig = {
  toilet: { emoji: "🚻", color: "#3B82F6", label: "Available" },
  park: { emoji: "🌳", color: "#22C55E", label: "Open" },
  hospital: { emoji: "🏥", color: "#EF4444", label: "24/7" },
  temple: { emoji: "🛕", color: "#F59E0B", label: "Open" },
  school: { emoji: "🏫", color: "#8B5CF6", label: "Active" },
  police: { emoji: "👮", color: "#0EA5E9", label: "On Duty" },
  streetlight: { emoji: "💡", color: "#FBBF24", label: "Working" },
  tourist: { emoji: "📸", color: "#EC4899", label: "Open" },
};

/* ===============================
   PIN-STYLE MAP ICON WITH CHECKPOINT NAME
================================ */
const createVehicleStyleIcon = (emoji, color, checkpointName) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:0px;
      ">
        <div style="
          width:40px;
          height:40px;
          background:${color};
          border:3px solid white;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:20px;
          box-shadow:0 4px 8px rgba(0,0,0,0.4);
          position:relative;
          z-index:1;
        ">
          ${emoji}
        </div>
        <div style="
          width:0;
          height:0;
          border-left:12px solid transparent;
          border-right:12px solid transparent;
          border-top:15px solid ${color};
          margin-top:-2px;
        "></div>
        <div style="
          background:white;
          color:${color};
          padding:3px 8px;
          border-radius:4px;
          font-size:11px;
          font-weight:bold;
          border:2px solid ${color};
          white-space:nowrap;
          margin-top:4px;
          box-shadow:0 2px 4px rgba(0,0,0,0.2);
        ">
          ${checkpointName}
        </div>
      </div>
    `,
    iconSize: [60, 90],
    iconAnchor: [30, 85],
    popupAnchor: [0, -40],
  });

/* ===============================
   MOCK CHECKPOINTS DATA
================================ */
const mockCheckpoints = [
  {
    _id: "1",
    name: "Main Park",
    category: "park",
    latitude: 22.5726,
    longitude: 88.3639,
    address: "Central City Area",
    status: "Open",
  },
  {
    _id: "2",
    name: "City Hospital",
    category: "hospital",
    latitude: 22.5750,
    longitude: 88.3700,
    address: "Medical District",
    status: "24/7",
  },
  {
    _id: "3",
    name: "Public Toilet 1",
    category: "toilet",
    latitude: 22.5700,
    longitude: 88.3600,
    address: "Downtown",
    status: "Available",
  },
  {
    _id: "4",
    name: "Ancient Temple",
    category: "temple",
    latitude: 22.5680,
    longitude: 88.3580,
    address: "Heritage Area",
    status: "Open",
  },
  {
    _id: "5",
    name: "Central School",
    category: "school",
    latitude: 22.5770,
    longitude: 88.3670,
    address: "Education Zone",
    status: "Active",
  },
  {
    _id: "6",
    name: "Police Station",
    category: "police",
    latitude: 22.5650,
    longitude: 88.3620,
    address: "Safety Zone",
    status: "On Duty",
  },
  {
    _id: "7",
    name: "Street Light Zone A",
    category: "streetlight",
    latitude: 22.5740,
    longitude: 88.3550,
    address: "Residential Area",
    status: "Working",
  },
  {
    _id: "8",
    name: "Tourism Center",
    category: "tourist",
    latitude: 22.5710,
    longitude: 88.3720,
    address: "Visitor Hub",
    status: "Open",
  },
  {
    _id: "9",
    name: "Park 2",
    category: "park",
    latitude: 22.5600,
    longitude: 88.3650,
    address: "South Zone",
    status: "Open",
  },
  {
    _id: "10",
    name: "Medical Clinic",
    category: "hospital",
    latitude: 22.5800,
    longitude: 88.3600,
    address: "North Area",
    status: "24/7",
  },
];

/* ===============================
   COMPONENT
================================ */
export default function CitizenCheckpoint() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [center, setCenter] = useState([22.5726, 88.3639]); // Kolkata

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/api/checkpoints");
        setCheckpoints(res.data || []);

        const initFilters = {};
        res.data.forEach((c) => (initFilters[c.category] = true));
        setFilters(initFilters);
      } catch (err) {
        console.error("Failed to load checkpoints, using mock data:", err);
        // Use mock data if API fails
        setCheckpoints(mockCheckpoints);
        const initFilters = {};
        mockCheckpoints.forEach((c) => (initFilters[c.category] = true));
        setFilters(initFilters);
      }
    };

    loadData();
  }, []);

  /* ===============================
     LOCATE ME
  ================================ */
  const locateMe = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  /* ===============================
     FILTER + SEARCH
  ================================ */
  const visibleCheckpoints = checkpoints.filter(
    (c) =>
      filters[c.category] &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-700">
          City Checkpoints Map
        </h1>
        <p className="text-sm text-gray-600">
          Vehicle-style live markers for civic infrastructure
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow">
        <input
          type="text"
          placeholder="Search checkpoint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm w-64"
        />

        <button
          onClick={locateMe}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm"
        >
          Locate Me
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.keys(categoryConfig).map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters[cat] || false}
              onChange={() =>
                setFilters({ ...filters, [cat]: !filters[cat] })
              }
            />
            <span>{categoryConfig[cat].emoji}</span>
            <span className="capitalize">{cat}</span>
          </label>
        ))}
      </div>

      {/* MAP */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <MapContainer center={center} zoom={13} className="h-[520px] w-full">
          <TileLayer
            attribution="Tiles © Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {visibleCheckpoints.map((c) => {
            const config = categoryConfig[c.category];

            return (
              <Marker
                key={c._id}
                position={[c.latitude, c.longitude]}
                icon={createVehicleStyleIcon(
                  config.emoji,
                  config.color,
                  c.name
                )}
              >
                <Popup>
                  <div className="text-sm space-y-1">
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="capitalize">Category: {c.category}</p>
                    <p className="text-xs text-gray-500">📍 {c.address}</p>
                    <p className="font-semibold">Status: {c.status || categoryConfig[c.category].label}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
