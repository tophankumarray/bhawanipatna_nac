// @ts-nocheck
import SupervisorLayout from "../../layouts/SupervisorLayout";

const Dashboard = () => {
  return (
    <SupervisorLayout>
      <h2 className="text-xl font-semibold mb-4">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          Total Wards: 24
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          Pending Collections: 6
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          Active Vehicles: 9
        </div>
      </div>
    </SupervisorLayout>
  );
};

export default Dashboard;
