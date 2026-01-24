// @ts-nocheck
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportWastePDF = ({ stats, rows }) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  /* ================= TITLE ================= */
  doc.setFontSize(18);
  doc.text("Waste Collection Report", 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 22);

  /* ================= SUMMARY TABLE ================= */
  autoTable(doc, {
    startY: 28,
    head: [["Metric", "Value"]],
    body: [
      ["Total Collections", stats.total],
      ["Completed", stats.completed],
      ["In Progress", stats.inProgress],
      ["Pending", stats.pending],
      ["Total Waste Collected", `${stats.totalWaste} tons`],
      ["Target Waste", `${stats.targetWaste} tons`],
    ],
    theme: "grid",
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [16, 185, 129], // emerald
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 80 },
    },
  });

  /* ================= COLLECTION TABLE ================= */
  const startY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text("Waste Collection Records", 14, startY - 2);

  autoTable(doc, {
    startY,
    head: [
      [
        "ID",
        "Ward",
        "Vehicle",
        "Driver",
        "Route",
        "Waste Type",
        "Collected (tons)",
        "Target (tons)",
        "Date",
        "Status",
      ],
    ],
    body: rows.map((c) => [
      c._id,
      c.ward,
      c.vehicle,
      c.driver,
      c.route,
      c.wasteType,
      c.quantity,
      c.targetQuantity,
      c.collectionDate,
      c.status.toUpperCase(),
    ]),
    theme: "striped",
    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 18 }, // ID
      1: { cellWidth: 20 }, // Ward
      2: { cellWidth: 25 }, // Vehicle
      3: { cellWidth: 25 }, // Driver
      4: { cellWidth: 22 }, // Route
      5: { cellWidth: 28 }, // Waste Type
      6: { cellWidth: 22 }, // Quantity
      7: { cellWidth: 22 }, // Target
      8: { cellWidth: 24 }, // Date
      9: { cellWidth: 22 }, // Status
    },
    margin: { left: 10, right: 10 },
  });

  /* ================= PAGE NUMBERS ================= */
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pages}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  /* ================= SAVE ================= */
  doc.save(`Waste_Collection_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
