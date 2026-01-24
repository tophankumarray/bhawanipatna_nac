// @ts-nocheck
const WardCoverage = ({ data }) => {
  const wards = data?.wards || [];

  const getStatusStyles = (status) => {
    switch (status) {
      case "good":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          dot: "bg-yellow-500",
        };
      case "critical":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const calculateStatus = (ward) => {
    const wastePerHousehold =
      ward.household > 0
        ? ward.wasteGenerationPerDay / ward.household
        : 0;

    if (ward.collectionFrequency === "Daily" && wastePerHousehold <= 2) {
      return { status: "good", coverage: 90 };
    }

    if (
      ward.collectionFrequency === "Alternate Day" ||
      wastePerHousehold <= 3
    ) {
      return { status: "warning", coverage: 65 };
    }

    return { status: "critical", coverage: 40 };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">
          Ward Coverage Status
        </h3>
        <div className="p-2 bg-emerald-50 rounded-lg">🏘️</div>
      </div>

      {wards.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-10">
          No ward coverage data available
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto">
          {wards.map((ward) => {
            const { status, coverage } = calculateStatus(ward);
            const styles = getStatusStyles(status);

            return (
              <div
                key={ward._id}
                className={`${styles.bg} border ${styles.border} rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                    <span className="font-semibold text-gray-800">
                      {ward.wardName}
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${styles.text}`}>
                    {coverage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white rounded-full h-2 mb-2">
                  <div
                    className={`${styles.dot} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${coverage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Status</span>
                  <span className="capitalize font-semibold">
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WardCoverage;
