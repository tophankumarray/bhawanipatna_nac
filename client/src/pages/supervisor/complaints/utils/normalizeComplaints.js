export const normalizeComplaints = (list = []) => {
  return list.map((c) => ({
    id: c._id || c.id,
    ward: c.ward || "N/A",
    type: c.title || c.category || "General Issue",
    image: c.photo
      ? `http://localhost:5900/${c.photo}`
      : c.image
      ? `http://localhost:5900/${c.image}`
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
      c.sla || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    location: c.location || "Berhampur, Odisha",
    description: c.description || "No description provided",
  }));
};
