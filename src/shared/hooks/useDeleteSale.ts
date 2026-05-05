import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteSale } from "../api/salesApi";

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};
