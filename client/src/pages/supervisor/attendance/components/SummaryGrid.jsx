import { SUMMARY_CONFIG } from "../attendanceConfig";
import SummaryCard from "./SummaryCard";

const SummaryGrid = ({ summaryValues }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {SUMMARY_CONFIG.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={summaryValues[card.key]}
          color={card.color}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default SummaryGrid;
