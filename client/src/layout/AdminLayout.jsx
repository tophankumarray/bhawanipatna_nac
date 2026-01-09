import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col w-full lg:ml-64 transition-all duration-300">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 mt-16 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
