import React from "react";
import { Globe } from "lucide-react";

export default function LanguageSelector({ i18n }) {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-gray-500" />
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="od">ଓଡ଼ିଆ</option>
        </select>
      </div>
    </div>
  );
}
