// @ts-nocheck
import { useEffect, useState } from "react";
// import SupervisorLayout from "../../layouts/SupervisorLayout";
import SupervisorLayout from "../../layout/SupervisorLayout";

const Wards = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // 🔹 Mock data (replace with API later)
    setTimeout(() => {
      setWards([
        { id: 1, name: "Ward 1", vehicle: "OD-07-GT-1023", status: "Collected" },
        { id: 2, name: "Ward 2", vehicle: "OD-07-GT-1048", status: "Pending" },
        { id: 3, name: "Ward 3", vehicle: "OD-07-GT-1099", status: "Collected" },
        { id: 4, name: "Ward 4", vehicle: "-", status: "Not Assigned" },
      ]);
      setLoading(false);
    }, 700);
  }, []);

  const filteredWards =
    filter === "All" ? wards : wards.filter((w) => w.status === filter);

  return (
    <SupervisorLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Ward Collection Status</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="All">All</option>
          <option value="Collected">Collected</option>
          <option value="Pending">Pending</option>
          <option value="Not Assigned">Not Assigned</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading wards...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-3">Ward</th>
                <th className="text-left px-4 py-3">Vehicle</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredWards.map((w) => (
                <tr
                  key={w.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{w.name}</td>
                  <td className="px-4 py-3">{w.vehicle}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={w.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SupervisorLayout>
  );
};

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }) => {
  let color = "bg-gray-400";

  if (status === "Collected") color = "bg-green-600";
  if (status === "Pending") color = "bg-yellow-500";
  if (status === "Not Assigned") color = "bg-red-500";

  return (
    <span
      className={`inline-block px-3 py-1 text-xs text-white rounded-full ${color}`}
    >
      {status}
    </span>
  );
};

export default Wards;
