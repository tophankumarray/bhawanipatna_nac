// @ts-nocheck
export const getWasteTypeIcon = (type) => {
  const icons = {
    "Mixed Waste": "🗑️",
    "Organic Waste": "🍃",
    Recyclable: "♻️",
    Hazardous: "⚠️",
  };
  return icons[type] || "🗑️";
};
