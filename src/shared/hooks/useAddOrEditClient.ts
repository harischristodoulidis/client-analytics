import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from "@tanstack/react-query";
import type { Client } from "../api/types/clients";

export const useAddOrEditClient = <TVars,>(
  fn: MutationFunction<Client[], TVars>,
) => {
  const queryClient = useQueryClient();

  return useMutation<Client[], Error, TVars>({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};
