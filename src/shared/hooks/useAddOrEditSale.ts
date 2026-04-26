import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sale } from "../api/types/sales";

type AddSaleFn = (payload: Omit<Sale, "id" | "created_at">) => Promise<Sale[]>;
type EditSaleFn = (payload: Sale) => Promise<Sale[]>;
type SaleMutation = AddSaleFn | EditSaleFn;

export const useAddOrEditSale = (fn: SaleMutation) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};
