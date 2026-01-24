// @ts-nocheck
import { useState } from "react";
import { useWasteCollection } from "./useWasteCollection";

import WasteCollectionHeader from "./components/WasteCollectionHeader";
import WasteStats from "./components/WasteStats";
import WasteProgress from "./components/WasteProgress";
import WasteFilters from "./components/WasteFilters";
import WasteTable from "./components/WasteTable";
import WasteModal from "./components/WasteModal";

import { exportWastePDF } from "./utils/pdfExport";

const WasteCollectionPage = () => {
  const {
    loading,
    filteredCollections,
    filters,
    setFilters,
    stats,
    getUniqueWards,

    /* form + actions */
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  } = useWasteCollection();

  const [showModal, setShowModal] = useState(false);

  /* ✅ ADD THIS */
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <WasteCollectionHeader
          onAdd={handleAdd}
          onDownload={() =>
            exportWastePDF({
              stats,
              rows: filteredCollections,
            })
          }
        />

        {/* STATS */}
        <WasteStats stats={stats} />

        {/* PROGRESS */}
        <WasteProgress
          totalWaste={stats.totalWaste}
          targetWaste={stats.targetWaste}
        />

        {/* FILTERS */}
        <WasteFilters
          filters={filters}
          setFilters={setFilters}
          getUniqueWards={getUniqueWards}
        />

        {/* TABLE */}
        <WasteTable
          loading={loading}
          filteredCollections={filteredCollections}
          handleEdit={(row) => {
            handleEdit(row);
            setShowModal(true);
          }}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      </div>

      {/* MODAL */}
      <WasteModal
        showModal={showModal}
        selectedCollection={null}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={(e) => handleSubmit(e, handleCloseModal)}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default WasteCollectionPage;
