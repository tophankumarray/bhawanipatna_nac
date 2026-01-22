import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Phone, User, Lock, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../api/api";

const LOGO = "image.jpg";

// if you want to download a fixed file from public folder:
const DOWNLOAD_URL = "/SBM 2.0.pdf"; // put this file in public/

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [role, setRole] = useState("citizen");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showNotice, setShowNotice] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const wasteCategories = [
    { name: "PAPER", color: "bg-blue-500", icon: "📄" },
    { name: "PLASTIC", color: "bg-yellow-500", icon: "♻️" },
    { name: "GLASS", color: "bg-cyan-500", icon: "🗑️" },
    { name: "ORGANIC", color: "bg-green-500", icon: "🌱" },
  ];

  // -------- shared helpers --------

  const saveLoginLog = async ({ role, phone, username, status }) => {
    try {
      await api.post("/loginLogs", {
        role,
        phone: phone || null,
        username: username || null,
        time: new Date().toISOString(),
        status,
      });
    } catch (error) {
      console.error("Failed to save login log", error);
    }
  };

  const ensureCitizenExists = async (phoneNumber) => {
    try {
      const { data: citizens } = await api.get("/citizens", {
        params: { phone: phoneNumber },
      });

      if (!citizens || citizens.length === 0) {
        await api.post("/citizens", {
          phone: phoneNumber,
        });
      }
    } catch (error) {
      console.error("Failed to ensure citizen exists", error);
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // simple file-download handler (from a fixed URL) [web:50]
  const handleDownloadGuide = () => {
    const link = document.createElement("a");
    link.href = DOWNLOAD_URL;
    link.download = "SBM 2.0.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------- citizen login --------

  const handleGetOtp = () => {
    if (phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setShowOtpInput(true);

    console.log("Generated OTP:", otp);
    toast.info(`Demo OTP: ${otp}`);
  };

  const handleVerifyOtp = async () => {
    if (otp === generatedOtp) {
      await ensureCitizenExists(phone);

      await saveLoginLog({
        role: "citizen",
        phone,
        username: null,
        status: "success",
      });

      login({ role: "citizen", phone });
      toast.success("Login successful!");
      navigate("/citizen");
    } else {
      await saveLoginLog({
        role: "citizen",
        phone,
        username: null,
        status: "failed",
      });
      toast.error("Invalid OTP");
    }
  };

  // -------- staff (admin/supervisor) login --------

  const handleStaffLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const { data: users } = await api.get("/users", {
        params: { username, password, role },
      });

      if (!users || users.length === 0) {
        await saveLoginLog({
          role,
          phone: null,
          username,
          status: "failed",
        });
        toast.error("Invalid username or password");
        return;
      }

      await saveLoginLog({
        role,
        phone: null,
        username,
        status: "success",
      });

      login({ role, username });
      toast.success("Login successful!");
      navigate(`/${role}`);
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  // -------- JSX --------

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gray-100">
      {/* Notice Popup */}
      {showNotice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src={LOGO} alt="Buguda Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-700 mb-3">
              Official Government Portal
            </h2>
            <p className="text-gray-600 mb-6">
              This is an official portal of BUGUDA N.A.C for Solid Waste Management.
              Please ensure you're on the correct website before entering any credentials.
            </p>
            <button
              onClick={() => setShowNotice(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Left Panel */}
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
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img src={LOGO} alt="Buguda Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t("BUGUDA NAC")}</h1>
              <p className="text-teal-100 text-sm">{t("municipalServices")}</p>
            </div>
          </div>

          {/* Main text */}
          <div className="mt-10">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4">
              {t("solidWaste")}
            </h2>
            <p className="text-lg text-emerald-100 font-medium mb-2">
              {t("joinMission")}
            </p>
            <p className="text-emerald-50 max-w-xl">{t("buildingFuture")}</p>
          </div>

          {/* Category cards */}
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

        {/* Footer */}
        <div className="relative z-10 px-12 pb-6">
          <p className="text-xs text-emerald-100">
            © 2025 BUGUDA N.A.C - All Rights Reserved
          </p>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img src={LOGO} alt="Buguda Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-9 border border-gray-100 relative">
            <div className="absolute -top-[3px] left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400" />

            {/* Language selector */}
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

            {/* Card logo circle */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img src={LOGO} alt="Ganjam Logo" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Role tabs */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                {["citizen", "supervisor", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowOtpInput(false);
                      setOtp("");
                      setPhone("");
                      setUsername("");
                      setPassword("");
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

            {/* Title + subtitle */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
              {t("loginTitle", { role: t(`roles.${role}`) })}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              {t("welcomeMessage")}
            </p>

            {/* Forms */}
            {role === "citizen" ? (
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
                      onClick={handleGetOtp}
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
                      onClick={handleVerifyOtp}
                      className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      {t("verifyOtp")}
                    </button>
                    <button
                      onClick={() => {
                        setShowOtpInput(false);
                        setOtp("");
                      }}
                      className="w-full mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      ← {t("changePhone")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("username")}
                </label>
                <div className="relative mb-4">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("username")}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password")}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  onClick={handleStaffLogin}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {t("login")}
                </button>

                {/* Download button ONLY for supervisor/admin */}
                {(role === "admin" || role === "supervisor") && (
                  <button
                    type="button"
                    onClick={handleDownloadGuide}
                    className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Download SWM Guide
                  </button>
                )}
              </div>
            )}

            <p className="text-xs text-center text-gray-500 mt-6">
              By logging in, you agree to our{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a
                href="mailto:support@ganjamnac.in"
                className="text-emerald-600 hover:underline font-medium"
              >
                [support@bugudanac.in](mailto:support@bugudanac.in)
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
