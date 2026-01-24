// @ts-nocheck
import React from "react";
import { useTranslation } from "react-i18next";

export default function RoleTabs({ role, setRole, onReset }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center gap-2 mb-8">
      <div className="inline-flex bg-gray-100 rounded-xl p-1">
        {["citizen", "supervisor", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              onReset();
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              role === r
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t(`roles.${r}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
