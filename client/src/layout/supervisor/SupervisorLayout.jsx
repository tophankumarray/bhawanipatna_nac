import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import SupervisorMobileTopbar from "./SupervisorMobileTopbar";
import SupervisorMobileDrawer from "./SupervisorMobileDrawer";
import SupervisorSidebar from "./SupervisorSidebar";
import SupervisorHeader from "./SupervisorHeader";
import { supervisorLinks } from "./supervisorLinks";

const SupervisorLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const LOGO = "/image.jpg";

  const handleLogout = () => {
    toast.success("Logged out successfully");
    logout();

    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* MOBILE TOP BAR */}
      <SupervisorMobileTopbar logo={LOGO} onOpen={() => setOpen(true)} />

      {/* MOBILE DRAWER */}
      <SupervisorMobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        links={supervisorLinks}
        onLogout={handleLogout}
      />

      {/* DESKTOP SIDEBAR */}
      <SupervisorSidebar logo={LOGO} links={supervisorLinks} />

      {/* DESKTOP HEADER */}
      <SupervisorHeader onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-0 md:ml-64 pt-16 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SupervisorLayout;
