import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from "@tanstack/react-query";
import type { Sale } from "../api/types/sales";

export const useAddOrEditSale = <TVars,>(
  fn: MutationFunction<Sale[], TVars>,
) => {
  const queryClient = useQueryClient();

  return useMutation<Sale[], Error, TVars>({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};
