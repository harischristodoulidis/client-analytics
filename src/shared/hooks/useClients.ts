import { useEffect } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchClients, type ClientParams } from "../api/clientsApi";

export const useClients = (params: ClientParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["clients", params],
    queryFn: () => fetchClients(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Prefetch next page in the background
  useEffect(() => {
    if (!query.data) return;
    const { page } = params;
    if (page < query.data.total_pages) {
      queryClient.prefetchQuery({
        queryKey: ["clients", { ...params, page: page + 1 }],
        queryFn: () => fetchClients({ ...params, page: page + 1 }),
      });
    }
  }, [query.data, params, queryClient]);

  return query;
};
