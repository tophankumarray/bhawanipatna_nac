import { LogOut } from "lucide-react";

const SupervisorHeader = ({ onLogout }) => {
  return (
    <header
      className="hidden md:flex fixed top-0 left-64 right-0 h-20 
      bg-white border-b z-40 items-center justify-end px-6 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700"
    >
      <button
        onClick={onLogout}
        className="flex items-center gap-2 
        bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
};

export default SupervisorHeader;
