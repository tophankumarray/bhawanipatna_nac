// @ts-nocheck

export const normalizeComplaints = (list = []) =>
  list.map(item => ({
    id: item._id,
    title: item.category?.[0] || "Complaint",
    citizenName: item.fullName,
    citizenPhone: item.phoneNumber,
    location: `${item.area}, Ward ${item.wardNumber}`,
    category: item.category?.join(", "),
    description: item.description,
    photo: item.image
      ? `http://localhost:5900/${item.image}`
      : null,

    status: item.status?.toLowerCase().replace(" ", "-"),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

export const getStatusColor = (status) => ({
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
}[status] || "bg-gray-100 text-gray-800");
