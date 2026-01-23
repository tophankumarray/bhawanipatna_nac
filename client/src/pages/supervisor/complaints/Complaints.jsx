// @ts-nocheck
import { useEffect, useState } from "react";
// import api from "../../../../api/api";
import { toast } from "react-toastify";

import { normalizeComplaints } from "./utils/normalizeComplaints";

import ComplaintsHeader from "./components/ComplaintsHeader";
import ComplaintFilters from "./components/ComplaintFilters";
import ComplaintsTable from "./components/ComplaintsTable";
import ComplaintsMobileCards from "./components/ComplaintsMobileCards";
import ImagePreviewModal from "./components/ImagePreviewModal";
import RouteMapModal from "./components/RouteMapModal";
import api from "../../../api/api";

const Complaints = () => {
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState(null);
  const [mapView, setMapView] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComplaints = async () => {
    try {
      setLoading(true);

      const res = await api.get("/complaints/allcomplaints");
      const list = res.data?.data || res.data || [];

      setComplaints(normalizeComplaints(list));
    } catch (err) {
      console.error("Failed to load complaints:", err);
      toast.error("Failed to load complaints ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const isSLABreached = (sla, status) =>
    status !== "Resolved" && new Date() > new Date(sla);

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((c) => c.status?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="space-y-6">
      <ComplaintsHeader />

      <ComplaintFilters activeFilter={filter} onChange={setFilter} />

      {loading && (
        <div className="text-sm text-gray-600 font-medium">
          Loading complaints...
        </div>
      )}

      <ComplaintsTable
        data={filteredComplaints}
        loading={loading}
        onPreview={setPreview}
        onRoute={setMapView}
        isSLABreached={isSLABreached}
      />

      <ComplaintsMobileCards
        data={filteredComplaints}
        loading={loading}
        onPreview={setPreview}
        onRoute={setMapView}
        isSLABreached={isSLABreached}
      />

      <ImagePreviewModal src={preview} onClose={() => setPreview(null)} />

      <RouteMapModal location={mapView} onClose={() => setMapView(null)} />

      <p className="text-xs text-gray-500">
        ✔ SLA-based monitoring enabled <br />
        ✔ Status lifecycle enforced for audit compliance <br />
        ✔ Geo-tagging & image evidence supported (production)
      </p>
    </div>
  );
};

export default Complaints;
