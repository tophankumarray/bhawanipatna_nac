import React from "react";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CitizenLoginForm({
  showOtpInput,
  phone,
  setPhone,
  otp,
  setOtp,
  generatedOtp,
  onGetOtp,
  onVerifyOtp,
  onChangePhone,
}) {
  const { t } = useTranslation();

  return (
    <>
      {!showOtpInput ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("phone")}
          </label>

          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) &&
                e.target.value.length <= 10 &&
                setPhone(e.target.value)
              }
              placeholder={t("phone")}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={onGetOtp}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {t("getOtp")}
          </button>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("enterOtp")}
          </label>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t("enterOtp")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />

          <p className="text-xs text-center text-gray-500 mt-2">
            Demo OTP:{" "}
            <span className="font-bold text-emerald-600">{generatedOtp}</span>
          </p>

          <button
            onClick={onVerifyOtp}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {t("verifyOtp")}
          </button>

          <button
            onClick={onChangePhone}
            className="w-full mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← {t("changePhone")}
          </button>
        </div>
      )}
    </>
  );
}
