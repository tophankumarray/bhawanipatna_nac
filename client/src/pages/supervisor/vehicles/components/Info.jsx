const Info = ({ label, value }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border">
      <p className="text-xs text-gray-500 font-semibold">{label}</p>
      <p className="font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default Info;
