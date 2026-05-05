import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from "@tanstack/react-query";
import type { Sale } from "../api/types/sales";

export const useAddOrEditSale = <T>(fn: MutationFunction<Sale[], T>) => {
  const queryClient = useQueryClient();

  return useMutation<Sale[], Error, T>({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};
