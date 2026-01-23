import React from "react";
import { useTranslation } from "react-i18next";
import { LOGO, wasteCategories } from "../utils/loginHelpers";

export default function LeftPanel() {
  const { t } = useTranslation();

  return (
    <div
      className="lg:w-1/2 hidden lg:flex flex-col justify-between relative overflow-hidden bg-cover bg-bottom"
      style={{
        backgroundImage: "url('/bg-green.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/70 via-emerald-700/40 to-emerald-900/80" />

      <div className="relative z-10 px-12 pt-10 pb-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            <img src={LOGO} alt="Buguda Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t("BUGUDA NAC")}</h1>
            <p className="text-teal-100 text-sm">{t("municipalServices")}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4">
            {t("solidWaste")}
          </h2>
          <p className="text-lg text-emerald-100 font-medium mb-2">{t("joinMission")}</p>
          <p className="text-emerald-50 max-w-xl">{t("buildingFuture")}</p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-10 max-w-3xl">
          {wasteCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-emerald-600/90 rounded-2xl px-6 py-5 shadow-md flex flex-col items-center justify-center hover:scale-[1.02] hover:bg-emerald-600 transition-transform"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <button
                type="button"
                className={`${category.color} text-white text-xs font-bold px-4 py-1 rounded-full mb-1`}
              >
                {category.name}
              </button>
              <p className="text-emerald-100 text-xs">Recyclable</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-12 pb-6">
        <p className="text-xs text-emerald-100">© 2025 BUGUDA N.A.C - All Rights Reserved</p>
      </div>
    </div>
  );
}
