// @ts-nocheck
import StatsCard from "../../../components/admin/StatsCard";
import { useSupervisors } from "./useSupervisors";

import SupervisorTable from "./components/SupervisorTable";
import SupervisorModal from "./components/SupervisorModal";

const SupervisorsPage = () => {
  const {
    supervisors,
    loading,
    showModal,
    setShowModal,
    selectedSupervisor,
    formData,
    setFormData,
    generatePassword,
    handleSubmit,
    handleEdit,
    handleDelete,
    closeModal,
  } = useSupervisors();

  const statsCards = [
    {
      title: "Total Supervisors",
      value: supervisors.length,
      icon: "👥",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Active",
      value: supervisors.filter(s => s.status === "active").length,
      icon: "✅",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Inactive",
      value: supervisors.filter(s => s.status === "inactive").length,
      icon: "⏳",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Supervisor Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage supervisor accounts
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            ➕ Add Supervisor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} showButton={false} />
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          </div>
        ) : (
          <SupervisorTable
            supervisors={supervisors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <SupervisorModal
      showModal={showModal}
      selectedSupervisor={selectedSupervisor}
      formData={formData}
      setFormData={setFormData}
      generatePassword={generatePassword}
      handleSubmit={handleSubmit}
      handleCloseModal={closeModal}
    />

    </div>
  );
};

export default SupervisorsPage;
