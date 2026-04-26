import { useQuery } from "@tanstack/react-query";
import { getClientByName } from "../api/clientsApi";

export const useGetClientByName = (params: { search: string }) => {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => getClientByName(params),
  });
};
