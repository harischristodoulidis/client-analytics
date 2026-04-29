import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { fetchSalesByCustomer } from "../../../shared/api/salesApi";
import type { PieEntry } from "../../../shared/api/types/PieEntry";

const AMOUNT_LIMIT = 250;

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#EC4899",
  "#14B8A6",
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: PieEntry }[];
}) => {
  if (!active || !payload?.length) return null;
  const { name, value, percentage, completedCount } = payload[0].payload;
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-sm text-xs space-y-1">
      <p className="font-semibold">{name}</p>
      <p>
        Total spent:{" "}
        <span className="font-medium">${value.toLocaleString()}</span>
      </p>
      <p>
        Share of total: <span className="font-medium">{percentage}%</span>
      </p>
      <p className="text-muted-foreground">
        Completed transactions: {completedCount}
      </p>
      {name === "Others" && (
        <p className="text-muted-foreground italic border-t border-border pt-1 mt-1">
          Clients with total spent &lt; $250
        </p>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => (
  <Sector {...props} outerRadius={props.outerRadius + 10} />
);

export default function SalesChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales", "by-customer"],
    queryFn: fetchSalesByCustomer,
  });

  const pieData: PieEntry[] = (() => {
    if (!data) return [];

    const filteredData = data
      .filter((s) => s.total_amount >= AMOUNT_LIMIT)
      .map((s) => ({
        name: s.name,
        value: s.total_amount,
        completedCount: s.completed_count,
      }));

    const others = data.filter((s) => s.total_amount < AMOUNT_LIMIT);
    const othersTotal = others.reduce((sum, s) => sum + s.total_amount, 0);
    const othersCompletedCount = others.reduce(
      (sum, s) => sum + s.completed_count,
      0,
    );

    const entries = [
      ...filteredData,
      ...(othersTotal > 0
        ? [
            {
              name: "Others",
              value: othersTotal,
              completedCount: othersCompletedCount,
            },
          ]
        : []),
    ];

    const total = entries.reduce((sum, entry) => sum + entry.value, 0);

    return entries.map((entry, index) => ({
      ...entry,
      percentage: total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0",
      fill: entry.name === "Others" ? "#A78BFA" : COLORS[index % COLORS.length],
    }));
  })();

  return (
    <div className="bg-background rounded-xl p-4 md:p-6 shadow-sm border border-border">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
        Sales by Customer
      </h2>

      {isLoading && (
        <div className="flex items-center justify-center h-65 sm:h-72 md:h-96 text-sm text-muted-foreground">
          Loading...
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-65 sm:h-72 md:h-96 text-sm text-destructive">
          Failed to load sales data.
        </div>
      )}

      {!isLoading && !isError && pieData.length === 0 && (
        <div className="flex items-center justify-center h-65 sm:h-72 md:h-96 text-sm text-muted-foreground">
          No sales data available.
        </div>
      )}

      {!isLoading && !isError && pieData.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="h-65 sm:h-72 md:h-96 md:flex-1 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  dataKey="value"
                  isAnimationActive={false}
                  activeShape={renderActiveShape}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap md:flex-col gap-x-4 gap-y-2 md:gap-y-2.5 md:w-36 shrink-0">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
