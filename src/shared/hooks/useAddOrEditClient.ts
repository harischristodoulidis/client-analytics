import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from "@tanstack/react-query";
import type { Client } from "../api/types/clients";

export const useAddOrEditClient = <T>(fn: MutationFunction<Client[], T>) => {
  const queryClient = useQueryClient();

  return useMutation<Client[], Error, T>({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};
