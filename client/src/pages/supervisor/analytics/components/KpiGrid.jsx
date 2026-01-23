import { KPI_CONFIG } from "../analyticsConfig";
import SummaryCard from "./SummaryCard";

const KpiGrid = ({ values }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {KPI_CONFIG.map((kpi) => (
        <SummaryCard
          key={kpi.title}
          title={kpi.title}
          value={values[kpi.key]}
          icon={kpi.icon}
          variant={kpi.variant}
        />
      ))}
    </div>
  );
};

export default KpiGrid;
