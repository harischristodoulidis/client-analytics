import type { ClientStatus } from "../../shared/api/types/clients";

export const clientStatusVariants: Record<ClientStatus, string> = {
  all: "bg-muted text-muted-foreground",
  active: "bg-success/15 text-success",
  inactive: "bg-destructive/15 text-destructive",
  pending: "bg-warning/15 text-warning",
};
