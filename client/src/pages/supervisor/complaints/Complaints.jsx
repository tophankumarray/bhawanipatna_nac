// @ts-nocheck
import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
        <ComplaintsHeader />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
        <ComplaintFilters activeFilter={filter} onChange={setFilter} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-green-600 border-t-transparent animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">
              Loading complaints...
            </p>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <ComplaintsTable
        data={filteredComplaints}
        loading={loading}
        onPreview={setPreview}
        onRoute={setMapView}
        isSLABreached={isSLABreached}
      />

      {/* Mobile Cards */}
      <ComplaintsMobileCards
        data={filteredComplaints}
        loading={loading}
        onPreview={setPreview}
        onRoute={setMapView}
        isSLABreached={isSLABreached}
      />

      {/* Modals */}
      <ImagePreviewModal src={preview} onClose={() => setPreview(null)} />
      <RouteMapModal location={mapView} onClose={() => setMapView(null)} />

      {/* Footer Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 leading-relaxed">
          ✔ SLA-based monitoring enabled <br />
          ✔ Status lifecycle enforced for audit compliance <br />
          ✔ Geo-tagging & image evidence supported (production)
        </p>
      </div>
    </div>
  );
};

export default Complaints;
