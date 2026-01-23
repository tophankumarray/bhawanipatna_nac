const SummaryCard = ({ title, value, color, icon: Icon }) => {
  return (
    <div
      className={`w-full p-5 rounded-xl shadow text-white ${color} flex items-center justify-between`}
    >
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>

      <div className="bg-white/20 p-3 rounded-xl">
        <Icon size={28} />
      </div>
    </div>
  );
};

export default SummaryCard;
