export type ActivityAction =
  | "client_created"
  | "client_updated"
  | "client_status_changed"
  | "sale_created"
  | "sale_updated"
  | "sale_deleted"
  | "sale_status_changed";

export interface ActivityLogEntry {
  id: string;
  client_id: string;
  sale_id: string | null;
  action: ActivityAction;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
