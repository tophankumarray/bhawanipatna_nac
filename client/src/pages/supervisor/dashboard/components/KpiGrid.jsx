import StatCard from "./StatCard";

const KpiGrid = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <StatCard key={i} {...kpi} />
      ))}
    </div>
  );
};

export default KpiGrid;
