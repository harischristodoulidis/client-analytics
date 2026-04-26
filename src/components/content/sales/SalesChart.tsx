import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 3500 },
  { month: "Feb", revenue: 4200 },
  { month: "Mar", revenue: 3800 },
  { month: "Apr", revenue: 5100 },
  { month: "May", revenue: 4700 },
  { month: "Jun", revenue: 6200 },
  { month: "Jul", revenue: 5800 },
];

export default function SalesChart() {
  return (
    <div className="bg-background rounded-xl p-4 md:p-6 shadow-sm border border-border">
      <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
        Sales Performance
      </h2>
      <ResponsiveContainer width="100%" height={250} className="md:h-75">
        <BarChart
          data={salesData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            horizontal={true}
            vertical={true}
          />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
