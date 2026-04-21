import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
}

export function KPICard({ label, value, change, isPositive }: KPICardProps) {
  return (
    <div className="bg-background rounded-xl p-3 md:p-4 shadow-sm border border-border transition-shadow hover:shadow-md min-h-22.5 md:min-h-25 flex flex-col justify-between">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{value}</div>
      <div
        className={`flex items-center gap-1 text-xs ${isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
  );
}
