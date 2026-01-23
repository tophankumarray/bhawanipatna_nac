const MiniInfo = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 border rounded-xl p-3">
      <div className="flex items-center gap-2 text-gray-600 text-xs font-semibold">
        {icon} {label}
      </div>
      <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};

export default MiniInfo;
