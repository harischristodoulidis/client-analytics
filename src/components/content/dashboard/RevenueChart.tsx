import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRevenueData } from "../../../shared/hooks/useRevenueData";

interface RevenueChartProps {
  period: string | { from: Date; to: Date };
}

export default function RevenueChart({ period }: RevenueChartProps) {
  const { data: revenueData } = useRevenueData(period);

  return (
    <div className="bg-background rounded-xl p-4 md:p-6 shadow-sm border border-border">
      <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
        Revenue Overview
      </h2>
      <div key="revenue-chart-wrapper" className="w-full overflow-x-auto">
        <div className="min-w-75">
          <ResponsiveContainer width="100%" height={250} className="md:h-75">
            <LineChart
              data={revenueData}
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
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
