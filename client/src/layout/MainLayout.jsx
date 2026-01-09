// src/layouts/MainLayout.jsx
// Generic layout for future use (Citizen, Supervisor, etc.)
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-16 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
