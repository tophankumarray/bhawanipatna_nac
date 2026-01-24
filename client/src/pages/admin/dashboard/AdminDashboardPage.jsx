// @ts-nocheck
import HeaderSection from "./components/HeaderSection";
import LoadingScreen from "./components/LoadingScreen";
import StatsCards from "./components/StatsCards";

import useAdminDashboard from "./useAdminDashboard";

import FuelManagement from "../../../components/admin/FuelManagement";
import MapView from "../../../components/admin/MapView";
import PendingActions from "../../../components/admin/PendingActions";
import QuickActions from "../../../components/admin/QuickActions";
import RecentActivity from "../../../components/admin/RecentActivity";
import RouteCompletion from "../../../components/admin/RouteCompletion";
import StaffPerformance from "../../../components/admin/StaffPerformance";
import TodaysPerformance from "../../../components/admin/TodaysPerformance";
import VehiclesStatus from "../../../components/admin/VehiclesStatus";
import WardCoverage from "../../../components/admin/WardCoverage";
import ComplaintsStatus from "../complaints/components/ComplaintsStatus";
import SwachhtamMarquee from "./components/SwachhtamMarquee";


const AdminDashboardPage = () => {
  const {
    dashboardData,
    loading,
    fetchDashboardData,
  } = useAdminDashboard();

  /* ================= LOADING ================= */
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-green-300/40 to-emerald-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-teal-300/40 to-cyan-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-lime-200/20 to-green-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* Swachhtam Portal Alert */}
        <SwachhtamMarquee />

        {/* Header */}
        <HeaderSection
          onRefresh={() => fetchDashboardData(false, true)}
        />

        {/* Stats Cards */}
        <StatsCards dashboardData={dashboardData} />

        {/* Performance & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 sm:mb-10">
          <TodaysPerformance data={dashboardData.performance} />
          <ComplaintsStatus data={dashboardData.complaints} />
          <QuickActions />
        </div>

        {/* Ward / Vehicle / Pending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-8">
          <WardCoverage data={dashboardData.wardCoverage} />
          <VehiclesStatus data={dashboardData.vehicles} />
          <PendingActions data={dashboardData.pending} />
        </div>

        {/* Staff & Route */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
          <StaffPerformance data={dashboardData.staffPerformance} />
          <RouteCompletion data={dashboardData.routeCompletion} />
        </div>

        {/* Map */}
        <div className="mb-6 sm:mb-8">
          {Array.isArray(dashboardData.vehicleLocations) &&
          dashboardData.vehicleLocations.filter(
            (v) =>
              v.location &&
              typeof v.location.lat === "number" &&
              typeof v.location.lng === "number" &&
              !Number.isNaN(v.location.lat) &&
              !Number.isNaN(v.location.lng)
          ).length > 0 ? (
            <MapView
              vehicles={dashboardData.vehicleLocations.filter(
                (v) =>
                  v.location &&
                  typeof v.location.lat === "number" &&
                  typeof v.location.lng === "number" &&
                  !Number.isNaN(v.location.lat) &&
                  !Number.isNaN(v.location.lng)
              )}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <h3 className="text-lg font-bold text-gray-800">
                Live Vehicle Tracking
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Waiting for vehicle GPS data…
              </p>
            </div>
          )}
        </div>



        {/* Fuel & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="lg:col-span-2">
            <FuelManagement />
          </div>
          <RecentActivity activities={dashboardData.recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
