import React from "react";

export default function DefectStats({
  totalRecords,
  startedRecords,
  inProgressRecords,
  repairedRecords,
}) {
  const stats = [
    {
      title: "Total Defects",
      value: totalRecords,
      className: "from-blue-500 to-blue-600",
      text: "text-blue-100",
    },
    {
      title: "Started",
      value: startedRecords,
      className: "from-yellow-500 to-orange-500",
      text: "text-yellow-100",
    },
    {
      title: "In Progress",
      value: inProgressRecords,
      className: "from-purple-500 to-indigo-600",
      text: "text-indigo-100",
    },
    {
      title: "Repaired",
      value: repairedRecords,
      className: "from-green-500 to-emerald-600",
      text: "text-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-8 sm:mb-10">
      {stats.map((s) => (
        <div
          key={s.title}
          className={`bg-gradient-to-br ${s.className} rounded-2xl shadow-xl p-6 sm:p-7 text-white`}
        >
          <p className={`${s.text} text-sm font-semibold mb-2`}>{s.title}</p>
          <p className="text-4xl sm:text-5xl font-black">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
