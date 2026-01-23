import { Menu } from "lucide-react";

const SupervisorMobileTopbar = ({ logo, onOpen }) => {
  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 z-40 
      bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600
      shadow px-4 py-3 flex items-center justify-between text-white"
    >
      <div className="flex items-center gap-2">
        <img src={logo} className="h-8 w-8 rounded-full bg-white p-1" />
        <span className="font-semibold">Supervisor</span>
      </div>

      <button onClick={onOpen}>
        <Menu />
      </button>
    </div>
  );
};

export default SupervisorMobileTopbar;
