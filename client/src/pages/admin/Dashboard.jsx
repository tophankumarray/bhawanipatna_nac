// @ts-nocheck
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import ComplaintsStatus from '../../components/admin/ComplaintsStatus';
import FuelManagement from '../../components/admin/FuelManagement';
import MapView from '../../components/admin/MapView';
import PendingActions from '../../components/admin/PendingActions';
import QuickActions from '../../components/admin/QuickActions';
import RecentActivity from '../../components/admin/RecentActivity';
import RouteCompletion from '../../components/admin/RouteCompletion';
import StaffPerformance from '../../components/admin/StaffPerformance';
import StatsCard from '../../components/admin/StatsCard';
import TodaysPerformance from '../../components/admin/TodaysPerformance';
import VehiclesStatus from '../../components/admin/VehiclesStatus';
import WardCoverage from '../../components/admin/WardCoverage';

const AdminDashboard = () => {
  // State management for dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      waste: 0,
      vehicles: 0,
      activeStaff: 0,
      complaints: 0,
      wards: 0,
      citizens: 0
    },
    performance: {
      resolvedComplaints: 0,
      totalComplaints: 0,
      collectionRate: 0
    },
    pending: {
      pendingComplaints: 0,
      avgResponseTime: '0h'
    },
    wardCoverage: {
      wards: []
    },
    staffPerformance: {
      present: 0,
      absent: 0,
      onLeave: 0,
      attendanceRate: 0,
      tasksAssigned: 0,
      tasksCompleted: 0,
      tasksInProgress: 0
    },
    routeCompletion: {
      overallCompletion: 0,
      completedRoutes: 0,
      totalRoutes: 0,
      routes: []
    },
    fuelManagement: {
      todayUsage: 0,
      monthUsage: 0,
      totalCost: 0,
      avgCostPerLiter: 0,
      alerts: []
    },
    vehicles: {
      all: 0,
      overSpeeding: 0,
      running: 0,
      standing: 0,
      stopped: 0,
      dataNotRetrieving: 0
    },
    complaints: {
      pending: 0,
      open: 0,
      closed: 0,
      outOfScope: 0
    },
    recentActivities: [],
    vehicleLocations: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from API
  useEffect(() => {
    fetchDashboardData();
    
    // Optional: Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardData(true); // Silent refresh
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const normalizeComplaintStatus = (status) => {
  if (!status) return 'pending';

  return status
    .toLowerCase()
    .replace(' ', '-'); // "In Progress" → "in-progress"
};
const getVehicleStatus = (v) => {
  const lat = v.lat ?? v.latitude ?? v.lat_value;
  const lng = v.lng ?? v.longitude ?? v.lng_value;

  if (lat == null || lng == null) return 'dataNotRetrieving';
  if (Number(v.speed) > 0) return 'running';
  if (Number(v.speed) === 0) return 'standing';
  return 'stopped';
};
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};


  const fetchDashboardData = async (silent = false, showToast = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const attendance = [
  { status: 'Present' },
  { status: 'Present' },
  { status: 'Absent' },
  { status: 'Leave' },
];

const citizens = Array(120).fill({});
      // Fetch all data sources in parallel
    const [
  vehiclesResponse,
  complaintsResponse,
  wardsResponse,
  wasteCollectionsResponse,
  fuelRecordsResponse
] = await Promise.all([
  api.get('/tracking/trackings'),
  api.get('/complaints/allcomplaints'),
  api.get('/wards/getallwards'),
  api.get('/waste-collections/getwastecollection'),
  api.get('/fuel-management/get-all-fuel-management'),
]);

const vehicles =
  Array.isArray(vehiclesResponse.data?.data)
    ? vehiclesResponse.data.data
    : Array.isArray(vehiclesResponse.data?.data?.trackings)
      ? vehiclesResponse.data.data.trackings
      : Array.isArray(vehiclesResponse.data?.data?.list)
        ? vehiclesResponse.data.data.list
        : [];
if (!Array.isArray(vehicles)) {
  throw new Error('Vehicles is not an array');
}

const complaints = complaintsResponse.data?.data || [];
const wards = wardsResponse.data?.data || [];
const wasteCollections = wasteCollectionsResponse.data?.data || [];
const fuelRecords = fuelRecordsResponse.data?.data || [];

      // Calculate dynamic stats - Using correct field name 'targetQuantity'
      const totalWaste = wasteCollections.reduce((sum, w) => {
        return sum + parseFloat(w.targetQuantity || 0);
      }, 0) / 1000; // Convert to tons
      
      // Filter only specific active vehicles
      const activeVehicleNumbers = ['OD33AR9619', 'OD33AR9647', 'OD07AV6580', 'OD07AB8906', 'OD07AB8905'];
      const activeVehicles = vehicles.filter(v => {
        const regNumber = (v.registrationNumber || v.truck_number || '').replace(/\s+/g, '').toUpperCase();
        return activeVehicleNumbers.some(num => regNumber.includes(num.replace(/\s+/g, '').toUpperCase()));
      });
      const totalVehicles = activeVehicles.length;
      
      const presentStaff = attendance.filter(a => a.status === 'Present').length;
      const totalComplaints = complaints.length;
      const totalWards = wards.length;
      const totalCitizens = citizens.length;

      // Calculate vehicle status - only for active vehicles
     const runningVehicles = activeVehicles.filter(v => getVehicleStatus(v) === 'running').length;
const standingVehicles = activeVehicles.filter(v => getVehicleStatus(v) === 'standing').length;
const stoppedVehicles = activeVehicles.filter(v => getVehicleStatus(v) === 'stopped').length;
const dataNotRetrieving = activeVehicles.filter(v => getVehicleStatus(v) === 'dataNotRetrieving').length;


      // Calculate complaint status
     const normalizedComplaints = complaints.map(c => ({
        ...c,
        normalizedStatus: normalizeComplaintStatus(c.status),
      }));

      const pendingComplaints = normalizedComplaints.filter(
        c => c.normalizedStatus === 'pending'
      ).length;

      const openComplaints = normalizedComplaints.filter(
        c => c.normalizedStatus === 'in-progress'
      ).length;

      const closedComplaints = normalizedComplaints.filter(
        c => c.normalizedStatus === 'resolved'
      ).length;

const outOfScopeComplaints = 0; // backend doesn't have this


      // Calculate staff performance
      const absentStaff = attendance.filter(a => a.status === 'Absent').length;
      const onLeaveStaff = attendance.filter(a => a.status === 'Leave').length;
      const attendanceRate = attendance.length > 0 ? Math.round((presentStaff / attendance.length) * 100) : 0;

      // Calculate fuel stats
      const totalFuelCost = fuelRecords.reduce((sum, f) => sum + parseFloat(f.totalCost || 0), 0);
      const totalFuelQuantity = fuelRecords.reduce((sum, f) => sum + parseFloat(f.quantity || 0), 0);
      const avgCostPerLiter = totalFuelQuantity > 0 ? Math.round(totalFuelCost / totalFuelQuantity) : 0;

      // Map vehicles to vehicle locations format - only active vehicles
      const vehicleLocations = activeVehicles.map(v => ({
  id: v._id || v.id,
  registrationNumber: v.registrationNumber || v.truck_number,
  status: getVehicleStatus(v),
  lat: v.lat ?? v.latitude,
  lng: v.lng ?? v.longitude,
  speed: v.speed,
  assignedWard: v.assignedWard || v.address,
  lastUpdated: v.updatedAt || v.device_timestamp || new Date().toISOString(),
}));


      // Set calculated data
      setDashboardData({
        stats: {
          waste: totalWaste,
          vehicles: totalVehicles,
          activeStaff: presentStaff,
          complaints: totalComplaints,
          wards: totalWards,
          citizens: totalCitizens
        },
        performance: {
          resolvedComplaints: closedComplaints,
          totalComplaints: totalComplaints,
          collectionRate: dashboardData.performance?.collectionRate || 94,
          complaintsTrend: dashboardData.performance?.complaintsTrend || [],
          collectionTrend: dashboardData.performance?.collectionTrend || []
        },
        pending: {
          pendingComplaints: pendingComplaints,
          avgResponseTime: dashboardData.pending?.avgResponseTime || '2.4h'
        },
        wardCoverage: dashboardData.wardCoverage || { wards: [] },
        staffPerformance: {
          present: presentStaff,
          absent: absentStaff,
          onLeave: onLeaveStaff,
          attendanceRate: attendanceRate,
          tasksAssigned: dashboardData.staffPerformance?.tasksAssigned || 0,
          tasksCompleted: dashboardData.staffPerformance?.tasksCompleted || 0,
          tasksInProgress: dashboardData.staffPerformance?.tasksInProgress || 0
        },
        routeCompletion: dashboardData.routeCompletion || {
          overallCompletion: 0,
          completedRoutes: 0,
          totalRoutes: 0,
          routes: []
        },
        fuelManagement: {
          todayUsage: dashboardData.fuelManagement?.todayUsage || 0,
          monthUsage: dashboardData.fuelManagement?.monthUsage || 0,
          totalCost: Math.round(totalFuelCost),
          avgCostPerLiter: avgCostPerLiter,
          alerts: dashboardData.fuelManagement?.alerts || []
        },
        vehicles: {
  all: safeNumber(totalVehicles),
  running: safeNumber(runningVehicles),
  standing: safeNumber(standingVehicles),
  stopped: safeNumber(stoppedVehicles),
  dataNotRetrieving: safeNumber(dataNotRetrieving),
},

       complaints: {
  pending: safeNumber(pendingComplaints),
  open: safeNumber(openComplaints),
  closed: safeNumber(closedComplaints),
  outOfScope: safeNumber(outOfScopeComplaints),
},

        recentActivities: dashboardData.recentActivities || [],
        vehicleLocations: vehicleLocations
      });
      
      if (showToast) {
        toast.success('Dashboard data refreshed successfully!');
      }
    } catch (error) {
      console.warn('API not available:', error.message);
      toast.error('Failed to load dashboard data');
      setError('Using offline data.');
    } finally {
      setLoading(false);
    }
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Waste Collection",
      value: dashboardData.stats.waste,
      icon: "♻️",
      gradient: "from-emerald-500 to-teal-600",
      link: "/admin/waste-collection"
    },
    {
      title: "Active Vehicles",
      value: dashboardData.stats.vehicles,
      icon: "🚛",
      gradient: "from-teal-500 to-cyan-600",
      link: "/admin/vehicles"
    },
    {
      title: "Staff Details",
      value: dashboardData.stats.activeStaff,
      icon: "👷",
      gradient: "from-blue-500 to-indigo-600",
      link: "/admin/attendance"
    },
    {
      title: "Complaints",
      value: dashboardData.stats.complaints,
      icon: "📧",
      gradient: "from-rose-500 to-pink-600",
      link: "/admin/complaints"
    },
    {
      title: "Total Wards",
      value: dashboardData.stats.wards,
      icon: "🏘️",
      gradient: "from-lime-600 to-green-600",
      link: "/admin/wards"
    },
    {
      title: "Registered Citizens",
      value: dashboardData.stats.citizens,
      icon: "👥",
      gradient: "from-purple-500 to-violet-600",
      link: null
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-emerald-50 via-green-50/50 to-teal-50 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
          </div>
          <p className="text-xl font-semibold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-green-300/40 to-emerald-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-teal-300/40 to-cyan-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-lime-200/20 to-green-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Swachhtam Portal Marquee - Jan 25 to Feb 25 ONLY */}
      {(() => {
        const now = new Date();
        const startDate = new Date('2026-01-20');
        const endDate = new Date('2026-02-25');
        const isSwachhtamPeriod = now >= startDate && now <= endDate;
        
        if (!isSwachhtamPeriod) return null;
        
        return (
          <div className="w-full bg-linear-to-r from-orange-500 via-red-500 to-pink-600 shadow-lg mb-6">
            <div className="overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap py-3 px-6">
                <div className="flex items-center gap-8">
                  <span className="text-white font-bold text-lg flex items-center gap-3">
                    🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨
                  </span>
                    <a 
              href="https://admin.sbmurban.org/u/login" 
              target="_blank" 
              
              className="text-white font-bold text-lg flex items-center gap-3 hover:text-orange-200 underline decoration-2 underline-offset-2 transition-all duration-200 hover:scale-105"
  
            >
              📱 https://admin.sbmurban.org/u/login 📱
            </a>
                  <span className="text-white font-bold text-lg flex items-center gap-3">
                    🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="relative z-10">
        {/* Welcome Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl sm:text-4xl font-extrabold bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3 animate-gradient">
                Command & Control Center 🌿
              </h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Real-time monitoring of waste management operations across all wards
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchDashboardData(false, true)}
                className="bg-white hover:bg-emerald-50 px-4 py-2 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
                title="Refresh Dashboard"
              >
                <span className="text-xl">🔄</span>
              </button>
              <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100">
                <p className="text-xs text-gray-500">Current Date</p>
                <p className="font-semibold text-gray-800">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {statsCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              gradient={stat.gradient}
              link={stat.link}
            />
          ))}
        </div>

        {/* Performance & Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 sm:mb-10">
          <TodaysPerformance data={dashboardData.performance} />
          <ComplaintsStatus data={dashboardData.complaints} />
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-8">
          {/* Ward Coverage */}
          <WardCoverage data={dashboardData.wardCoverage} />

          {/* Vehicles Status */}
          <VehiclesStatus data={dashboardData.vehicles} />

          {/* Complaints Status */}
          <PendingActions data={dashboardData.pending} />
        </div>

        {/* Staff & Route Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
          <StaffPerformance data={dashboardData.staffPerformance} />
          <RouteCompletion data={dashboardData.routeCompletion} />
        </div>

        {/* Fuel Management */}
        <div className="mb-6 sm:mb-8">
          <MapView vehicles={dashboardData.vehicleLocations} />
        </div>

        {/* Map & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="lg:col-span-2">
            <FuelManagement data={dashboardData.fuelManagement} />
          </div>
          <RecentActivity activities={dashboardData.recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
