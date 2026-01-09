// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../api/api";

/* ================= CONFIG ================= */

const FILTERS = ["All", "Pending", "In Progress", "Resolved"];

const TABLE_HEADERS = [
  "ID",
  "Photo",
  "Ward",
  "Issue",
  "Priority",
  "Vehicle",
  "Status",
  "SLA",
  "Route",
  "Action",
];

const STATUS_FLOW = {
  Pending: ["In Progress"],
  "In Progress": ["Resolved"],
  Resolved: [],
};

const STATUS_COLOR = {
  pending: "bg-red-100 text-red-700",
  open: "bg-red-100 text-red-700",
  "in progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-green-100 text-green-700",
};

const PRIORITY_COLOR = {
  high: "text-red-600 font-semibold",
  medium: "text-orange-600 font-semibold",
  low: "text-green-600 font-semibold",
};

/* ================= MAIN COMPONENT ================= */

const Complaints = () => {
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState(null);
  const [mapView, setMapView] = useState(null);
  const [complaints, setComplaints] = useState([]);

  /* ================= LOAD COMPLAINTS ================= */

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const res = await api.get("/complaints");

        if (res.data?.length) {
          setComplaints(
            res.data.map((c) => ({
              id: c.id,
              ward: c.ward || "N/A",
              type: c.title || c.category || "General Issue",
              image:
                c.photo && c.photo !== ""
                  ? c.photo
                  : "https://via.placeholder.com/300",
              vehicle: c.vehicle || "Not Assigned",
              driver: c.driver || "Not Assigned",
              status: c.status || "Pending",
              priority: c.priority || "Medium",
              date: c.createdAt
                ? new Date(c.createdAt).toLocaleDateString()
                : new Date().toISOString().split("T")[0],
              updatedAt: c.updatedAt
                ? new Date(c.updatedAt).toLocaleTimeString()
                : new Date().toLocaleTimeString(),
              sla:
                c.sla ||
                new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
              location: c.location || "Berhampur, Odisha",
              description: c.description || "No description provided",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load complaints:", err);
      }
    };

    loadComplaints();
  }, []);

  /* ================= HELPERS ================= */

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Mark complaint as "${newStatus}"?`)) return;

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: newStatus, updatedAt: new Date().toLocaleTimeString() }
          : c
      )
    );

    try {
      await api.patch(`/complaints/${id}`, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const isSLABreached = (sla, status) =>
    status !== "Resolved" && new Date() > new Date(sla);

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(
          (c) => c.status?.toLowerCase() === filter.toLowerCase()
        );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">
          Citizen Complaint Management
        </h2>
        <p className="text-sm text-gray-500">
          Supervisor resolution & monitoring (ICT Compliant)
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              filter === f
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-gray-600 uppercase text-xs tracking-wide">
                {TABLE_HEADERS.map((h) => (
                  <th key={h} className="px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredComplaints.map((c) => {
                const breached = isSLABreached(c.sla, c.status);
                const nextStatuses = STATUS_FLOW[c.status] || [];

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-gray-50 ${
                      breached ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-medium">{c.id}</td>

                    <td className="px-5 py-4">
                      <img
                        src={c.image}
                        onClick={() => setPreview(c.image)}
                        className="w-14 h-14 rounded-lg object-cover border cursor-pointer"
                      />
                    </td>

                    <td className="px-5 py-4">{c.ward}</td>
                    <td className="px-5 py-4">{c.type}</td>

                    <td className={`px-5 py-4 ${PRIORITY_COLOR[c.priority?.toLowerCase()]}`}>
                      {c.priority}
                    </td>

                    <td className="px-5 py-4">{c.vehicle}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLOR[c.status?.toLowerCase()]
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      {breached ? (
                        <span className="text-red-600 font-semibold">
                          SLA Breached
                        </span>
                      ) : (
                        <span className="text-green-600">On Time</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setMapView(c.location)}
                        className="text-green-600 text-xs font-medium hover:underline"
                      >
                        View Route
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      {nextStatuses.length ? (
                        <select
                          defaultValue=""
                          onChange={(e) =>
                            updateStatus(c.id, e.target.value)
                          }
                          className="border rounded-lg px-3 py-1 text-xs"
                        >
                          <option value="" disabled>
                            Update
                          </option>
                          {nextStatuses.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <img src={preview} className="max-w-md rounded" />
            <button
              onClick={() => setPreview(null)}
              className="mt-3 w-full bg-green-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MAP MODAL */}
      {mapView && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] md:w-[70%] h-[70%] rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Route View – {mapView}</h3>
              <button onClick={() => setMapView(null)}>Close</button>
            </div>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapView
              )}&output=embed`}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* FOOT NOTE */}
      <p className="text-xs text-gray-500">
        ✔ SLA-based monitoring enabled <br />
        ✔ Status lifecycle enforced for audit compliance <br />
        ✔ Geo-tagging & image evidence supported (production)
      </p>
    </div>
  );
};

export default Complaints;
