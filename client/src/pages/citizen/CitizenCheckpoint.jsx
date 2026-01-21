// @ts-nocheck
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api/api";

/* ===============================
   FIX LEAFLET DEFAULT ICON ISSUE
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



export default function CitizenCheckpoint() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ===============================
     FETCH CHECKPOINT DATA
  ================================ */
  useEffect(() => {
    const loadCheckpoints = async () => {
      try {
        const res = await api.get("/api/checkpoints");
        setCheckpoints(res.data || []);
      } catch (err) {
        console.error("Failed to load checkpoints", err);
      }
    };

    loadCheckpoints();
  }, []);



  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-green-700">
          City Checkpoints Map
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Explore public facilities and civic infrastructure across the city.
        </p>
      </div>



      {/* MAP */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <MapContainer
          center={[22.5726, 88.3639]}
          zoom={13}
          className="h-[520px] w-full"
        >
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {checkpoints.map((c) => (
            <Marker
              key={c._id}
              position={[c.latitude, c.longitude]}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="capitalize text-gray-600">
                    {c.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* LEGEND */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-2">
          Map Legend
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-sm">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
