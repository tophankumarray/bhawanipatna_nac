// @ts-nocheck
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

export const generateFuelPDF = (filteredRecords, stats) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    /* ================= HEADER ================= */
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text("Fuel Management Report", 14, 16);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      14,
      23
    );

    /* ================= SUMMARY TABLE ================= */
    autoTable(doc, {
      startY: 28,
      head: [["Metric", "Value"]],
      body: [
        ["Total Records", stats.totalRecords],
        ["Total Fuel", `${stats.totalFuel} L`],
        ["Total Cost", `₹${stats.totalCost}`],
        ["Avg Efficiency", `${stats.avgEfficiency} km/L`],
        ["Diesel Records", stats.dieselRecords],
        ["Petrol Records", stats.petrolRecords],
      ],
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 65, fontStyle: "bold" },
        1: { cellWidth: 85 },
      },
    });

    const startY = doc.lastAutoTable?.finalY || 35;

    /* ================= RECORDS TITLE ================= */
    doc.setFontSize(12);
    doc.text("Fuel Records", 14, startY + 8);

    /* ================= RECORDS TABLE ================= */
    autoTable(doc, {
      startY: startY + 12,
      head: [
        [
          "ID",
          "Vehicle",
          "Driver",
          "Date",
          "Fuel",
          "Qty(L)",
          "₹/L",
          "Total ₹",
          "Odometer",
          "Efficiency",
          "Station",
        ],
      ],
      body: filteredRecords.map((r) => [
        r._id,
        r.vehicle,
        r.driver,
        r.refuelDate,
        r.fuelType.toUpperCase(),
        r.quantity,
        r.pricePerLiter,
        r.totalCost,
        r.odometer,
        r.efficiency || "N/A",
        r.fillingStation,
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
        0: { cellWidth: 10 },
        1: { cellWidth: 22 },
        2: { cellWidth: 22 },
        3: { cellWidth: 18 },
        4: { cellWidth: 14 },
        5: { cellWidth: 14 },
        6: { cellWidth: 14 },
        7: { cellWidth: 16 },
        8: { cellWidth: 18 },
        9: { cellWidth: 18 },
        10: { cellWidth: 30 },
      },
      margin: { left: 10, right: 10 },
    });

    /* ================= FOOTER ================= */
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
    doc.save(`Fuel_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF downloaded successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to generate PDF");
  }
};
