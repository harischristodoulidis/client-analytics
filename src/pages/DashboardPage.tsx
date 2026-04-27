import { useState } from "react";
import PeriodSelector, {
  type PeriodOption,
} from "../components/content/dashboard/PeriodSelector";
import KPIs from "../components/content/dashboard/KPIs";
import RevenueChart from "../components/content/dashboard/RevenueChart";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("1y");
  const [customDateRange, setCustomDateRange] = useState<
    { from: Date; to: Date } | undefined
  >();

  const period =
    selectedPeriod === "custom" && customDateRange
      ? customDateRange
      : selectedPeriod;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onChange={setSelectedPeriod}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
        />
      </div>
      <KPIs period={period} />
      <RevenueChart period={period} />
    </div>
  );
}
