import { Download, FileSpreadsheet, Truck } from "lucide-react";

const VehiclesHeader = ({ onDownloadPDF, onDownloadExcel }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <Truck size={28} />
        <div>
          <h2 className="text-2xl font-bold">Vehicle Tracking</h2>
          <p className="text-sm opacity-90">
            Showing ONLY selected 5 vehicles (backend data)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-start md:justify-end">
        <button
          onClick={onDownloadPDF}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Download size={16} /> PDF
        </button>

        <button
          onClick={onDownloadExcel}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <FileSpreadsheet size={16} /> Excel
        </button>
      </div>
    </div>
  );
};

export default VehiclesHeader;
