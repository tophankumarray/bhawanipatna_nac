import { Cuboid } from "lucide-react";

const WealthHeader = () => {
  return (
    <div className="bg-gradient-to-r mx-auto max-w-7xl rounded-xl from-yellow-600 to-green-700 text-white py-6 px-4 sm:px-6 shadow-2xl mt-4">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Cuboid className="h-7 w-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Wealth Center</h1>
      </div>
    </div>
  );
};

export default WealthHeader;
