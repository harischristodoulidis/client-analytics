import type { ClientStatus } from "../../shared/api/types/clients";

export const clientStatusVariants: Record<ClientStatus, string> = {
  all: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};
