// @ts-nocheck
export const LOGO = "image.jpg";
export const DOWNLOAD_URL = "/SBM 2.0.pdf";

export const wasteCategories = [
  { name: "PAPER", color: "bg-blue-500", icon: "📄" },
  { name: "PLASTIC", color: "bg-yellow-500", icon: "♻️" },
  { name: "GLASS", color: "bg-cyan-500", icon: "🗑️" },
  { name: "ORGANIC", color: "bg-green-500", icon: "🌱" },
];

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const downloadFileFromPublic = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
