import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Client } from "../api/types/clients";

type AddClientFn = (payload: Omit<Client, "id">) => Promise<Client[]>;
type EditClientFn = (payload: Client) => Promise<Client[]>;
type ClientMutationFn = AddClientFn | EditClientFn;

export const useAddOrEditClient = (fn: ClientMutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
