import { Activity } from "lucide-react";
import { useClientActivity } from "../../../shared/hooks/useClientActivity";
import type { ActivityLogEntry } from "../../../shared/api/types/activityLog";

interface ClientRecentActivityProps {
  clientId: string;
}

const describeActivity = (entry: ActivityLogEntry): string => {
  const meta = entry.metadata as
    | { from?: string; to?: string }
    | null
    | undefined;

  switch (entry.action) {
    case "client_created":
      return "Client created";
    case "client_updated":
      return "Client details updated";
    case "client_status_changed":
      return `Status changed from ${meta?.from ?? "?"} to ${meta?.to ?? "?"}`;
    case "sale_created":
      return "New sale recorded";
    case "sale_updated":
      return "Sale updated";
    case "sale_deleted":
      return "Sale deleted";
    case "sale_status_changed":
      return `Sale status changed from ${meta?.from ?? "?"} to ${meta?.to ?? "?"}`;
  }
};

const formatTimestamp = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ClientRecentActivity({
  clientId,
}: ClientRecentActivityProps) {
  const { data, isLoading } = useClientActivity(clientId);

  if (isLoading) return null;

  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No recent activity to display.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((entry) => (
        <li key={entry.id} className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Activity className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{describeActivity(entry)}</p>
            <p className="text-xs text-muted-foreground">
              {formatTimestamp(entry.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
