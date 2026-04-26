import type { SaleStatus } from "../../shared/api/types/sales";

export const salesStatusVariants: Record<SaleStatus, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};
