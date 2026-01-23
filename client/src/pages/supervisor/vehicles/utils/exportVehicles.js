import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const downloadVehiclesPDF = (vehicles) => {
  const doc = new jsPDF("landscape");
  doc.setFontSize(16);
  doc.text("Vehicle Tracking Report", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [
      [
        "Vehicle No",
        "Driver",
        "Ward/Location",
        "GPS Status",
        "Ignition",
        "Speed",
        "Last Updated",
        "Latitude",
        "Longitude",
      ],
    ],
    body: vehicles.map((v) => [
      v.registrationNumber || "",
      v.driver || "",
      v.assignedWard || "",
      v.status || "",
      v.ignitionOn ? "ON" : "OFF",
      `${v.speed ?? 0} km/h`,
      v.lastUpdated ? v.lastUpdated.toLocaleString() : "N/A",
      v.lat ?? "N/A",
      v.lng ?? "N/A",
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] },
  });

  doc.save("vehicles-report.pdf");
};

export const downloadVehiclesExcel = (vehicles) => {
  const excelData = vehicles.map((v) => ({
    "Vehicle No": v.registrationNumber || "",
    Driver: v.driver || "",
    "Ward/Location": v.assignedWard || "",
    "GPS Status": v.status || "",
    Ignition: v.ignitionOn ? "ON" : "OFF",
    Speed: v.speed ?? 0,
    "Last Updated": v.lastUpdated ? v.lastUpdated.toLocaleString() : "N/A",
    Latitude: v.lat ?? "",
    Longitude: v.lng ?? "",
    "Signal Strength": v.signalStrength ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "vehicles-report.xlsx");
};
