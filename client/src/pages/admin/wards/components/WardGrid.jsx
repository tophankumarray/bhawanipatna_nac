// @ts-nocheck
import WardCard from "../../../../components/admin/WardCard";

const WardGrid = ({ wards }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {wards.map((ward) => (
        <WardCard
          key={ward._id}
          ward={ward}
        />
      ))}
    </div>
  );
};

export default WardGrid;
