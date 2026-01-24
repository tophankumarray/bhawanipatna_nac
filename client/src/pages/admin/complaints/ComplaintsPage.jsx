// @ts-nocheck
import StatsCard from "../../../components/admin/StatsCard";

import { useComplaints } from "./useComplaints";

import ComplaintFilters from "./components/ComplaintFilters";
import ComplaintTable from "./components/ComplaintTable";
import ComplaintModal from "./components/ComplaintModal";
import ImageModal from "./components/ImageModal";

const ComplaintsPage = () => {
  const {
    complaints,
    loading,
    filters,
    setFilters,
    filteredComplaints,
    selectedComplaint,
    setSelectedComplaint,
    imageModal,
    setImageModal,
    changeStatus,
  } = useComplaints();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">
          Loading complaints...
        </div>
      </div>
    );
  }

  /* ---------- Stats ---------- */
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  const statsCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: "📋",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏰",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: "🚧",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: "✅",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-100 p-4 sm:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Complaint Management 📋
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor and resolve citizen complaints efficiently
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            showButton={false}
          />
        ))}
      </div>

      {/* Filters */}
      <ComplaintFilters
        filters={filters}
        setFilters={setFilters}
      />

      {/* Table */}
      <ComplaintTable
        complaints={filteredComplaints}
        onStatusChange={changeStatus}
        onView={setSelectedComplaint}
        onImage={setImageModal}
      />

      {/* View Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onImage={setImageModal}
        />
      )}

      {/* Image Modal */}
      {imageModal && (
        <ImageModal
          src={imageModal}
          onClose={() => setImageModal(null)}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;
