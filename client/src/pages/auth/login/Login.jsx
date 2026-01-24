// @ts-nocheck
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CitizenLoginForm from "./components/CitizenLoginForm";
import LanguageSelector from "./components/LanguageSelector";
import LeftPanel from "./components/LeftPanel";
import LoginFooterHelp from "./components/LoginFooterHelp";
import NoticePopup from "./components/NoticePopup";
import RoleTabs from "./components/RoleTabs";
import StaffLoginForm from "./components/StaffLoginForm";

import { adminLogin, supervisorLogin } from "../../../api/admin/auth.api";
import api from "../../../api/mockAPI";
import { useAuth } from "../../../context/AuthContext";
import {
  DOWNLOAD_URL,
  downloadFileFromPublic,
  generateOtp,
  LOGO,
} from "./utils/loginHelpers";

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

  /* -------- shared helpers -------- */

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
        await api.post("/citizens", { phone: phoneNumber });
      }
    } catch (error) {
      console.error("Failed to ensure citizen exists", error);
    }
  };

  const handleDownloadGuide = () => {
    downloadFileFromPublic(DOWNLOAD_URL, "SBM 2.0.pdf");
  };

  /* -------- citizen login -------- */

  const handleGetOtp = () => {
    if (phone.length !== 10) {
      toast.warning("Phone number must be 10 digits ❗");
      return;
    }

    const otpValue = generateOtp();
    setGeneratedOtp(otpValue);
    setShowOtpInput(true);

    console.log("Generated OTP:", otpValue);
    toast.info(`Demo OTP: ${otpValue}`);
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
      toast.error("Invalid OTP ❌");
    }
  };

  /* -------- staff login -------- */

  const handleStaffLogin = async () => {
    if (!username || !password) {
      toast.warning("Please enter username and password ❗");
      return;
    }

    try {
      let response;

      // Call appropriate API based on role
      if (role === "admin") {
        response = await adminLogin(username, password);
      } else if (role === "supervisor") {
        response = await supervisorLogin(username, password);
      } else {
        // For other roles (driver, etc.), use mock API
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
          toast.error("Invalid username or password ❌");
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
        return;
      }

      // Handle admin and supervisor login response
      if (response.success || response.message?.includes("successful")) {
        await saveLoginLog({
          role,
          phone: null,
          username,
          status: "success",
        });

        // Store user data based on role
        const userData = {
          role,
          username,
          ...(response.data && { ...response.data }),
        };

        // Store token if provided
        const token = response.token || null;
        login(userData, token);
        
        toast.success(response.message || "Login successful!");
        navigate(`/${role}`);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      await saveLoginLog({
        role,
        phone: null,
        username,
        status: "failed",
      });

      const errorMessage = error.message || error.error || "Invalid username or password ❌";
      toast.error(errorMessage);
    }
  };

  /* -------- reset on role change -------- */

  const resetFormOnRoleChange = () => {
    setShowOtpInput(false);
    setOtp("");
    setPhone("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gray-100">
      <NoticePopup showNotice={showNotice} onClose={() => setShowNotice(false)} />

      <LeftPanel />

      <div className="lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img src={LOGO} alt="Buguda Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-9 border border-gray-100 relative">
            <div className="absolute -top-[3px] left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400" />

            <LanguageSelector i18n={i18n} />

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img src={LOGO} alt="Ganjam Logo" className="w-full h-full object-cover" />
              </div>
            </div>

            <RoleTabs role={role} setRole={setRole} onReset={resetFormOnRoleChange} />

            <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
              {t("loginTitle", { role: t(`roles.${role}`) })}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              {t("welcomeMessage")}
            </p>

            {role === "citizen" ? (
              <CitizenLoginForm
                showOtpInput={showOtpInput}
                phone={phone}
                setPhone={setPhone}
                otp={otp}
                setOtp={setOtp}
                generatedOtp={generatedOtp}
                onGetOtp={handleGetOtp}
                onVerifyOtp={handleVerifyOtp}
                onChangePhone={() => {
                  setShowOtpInput(false);
                  setOtp("");
                }}
              />
            ) : (
              <StaffLoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                onLogin={handleStaffLogin}
                role={role}
                onDownloadGuide={handleDownloadGuide}
              />
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

          <LoginFooterHelp />
        </div>
      </div>
    </div>
  );
};

export default Login;
