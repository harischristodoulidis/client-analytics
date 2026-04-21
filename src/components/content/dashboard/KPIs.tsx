import { useKPIs } from "../../../shared/hooks/useKPIs";
import { KPICard } from "./KPICard";

interface KPIsProps {
  period: string | { from: Date; to: Date };
}

export default function KPIs({ period }: KPIsProps) {
  const { data: kpis } = useKPIs(period);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {kpis?.map((kpi) => (
        <KPICard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          isPositive={kpi.isPositive}
        />
      ))}
    </div>
  );
}
