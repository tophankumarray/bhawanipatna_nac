import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { COLORS } from "../analyticsConfig";

const VehicleStatusPie = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">
        Vehicle Status Distribution
      </h3>

      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((v) => (
                <Cell key={v.name} fill={COLORS[v.name] || "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VehicleStatusPie;
