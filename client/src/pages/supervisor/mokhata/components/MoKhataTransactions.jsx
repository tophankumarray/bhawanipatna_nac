const TxRow = ({ t }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-xl">
      <div>
        <p className="font-bold text-gray-800">
          {t.type === "MAKE" ? "➕ Made" : "➖ Sold"} : {t.amount}
        </p>
        <p className="text-sm text-gray-500">{t.date}</p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${
          t.type === "MAKE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {t.type}
      </span>
    </div>
  );
};

const MoKhataTransactions = ({ transactions }) => {
  const last10 = transactions.slice().reverse().slice(0, 10);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Transactions History
      </h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="space-y-3">
          {last10.map((t) => (
            <TxRow key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoKhataTransactions;
