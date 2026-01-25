// @ts-nocheck
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const downloadVehiclesPDF = (vehicles = []) => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(16);
  doc.text("Vehicle Report", 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [
      [
        "Vehicle No",
        "Ward",
        "Speed",
        "Status",
        "Signal",
        "Ignition",
        "Last Update",
      ],
    ],
    body: vehicles.map((v) => [
      v.registrationNumber,
      v.assignedWard,
      v.speed,
      v.status,
      v.signalStrength,
      v.ignitionOn ? "ON" : "OFF",
      v.lastUpdated ? v.lastUpdated.toLocaleString() : "-",
    ]),
    styles: { fontSize: 9 },
  });

  doc.save(`vehicles-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const downloadVehiclesExcel = (vehicles = []) => {
  const sheetData = vehicles.map((v) => ({
    VehicleNo: v.registrationNumber,
    Ward: v.assignedWard,
    Speed: v.speed,
    Status: v.status,
    Signal: v.signalStrength,
    Ignition: v.ignitionOn ? "ON" : "OFF",
    LastUpdate: v.lastUpdated ? v.lastUpdated.toLocaleString() : "-",
  }));

  const ws = XLSX.utils.json_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vehicles");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `vehicles-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
};
