import type { SaleStatus } from "../../shared/api/types/sales";

export const salesStatusVariants: Record<SaleStatus, string> = {
  completed: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  failed: "bg-destructive/15 text-destructive",
};
