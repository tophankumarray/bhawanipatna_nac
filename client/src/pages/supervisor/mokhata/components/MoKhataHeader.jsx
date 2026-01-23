import { ArrowLeft, Download } from "lucide-react";

const MoKhataHeader = ({ onBack, onDownloadPDF }) => {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mo Khata</h1>
            </div>
          </div>

          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </header>
  );
};

export default MoKhataHeader;
