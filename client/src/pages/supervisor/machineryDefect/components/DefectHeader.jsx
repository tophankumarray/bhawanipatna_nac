import React from "react";
import { Wrench, Plus } from "lucide-react";

export default function DefectHeader({ onAdd }) {
  return (
    <div className="max-w-7xl bg-gradient-to-r mx-auto px-4 sm:px-7 rounded-xl from-emerald-600 to-teal-600 text-white py-6 sm:py-8 shadow-2xl mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-3 rounded-xl">
              <Wrench className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold">Machinery Defect</h1>
          </div>

          <p className="text-emerald-100 text-sm sm:text-lg sm:ml-16">
            Monitor, track, and resolve equipment issues in real-time
          </p>
        </div>

        <button
          onClick={onAdd}
          className="w-full sm:w-auto px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Add Defect
        </button>
      </div>
    </div>
  );
}
