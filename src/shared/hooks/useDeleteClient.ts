import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteClient } from "../api/clientsApi";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
