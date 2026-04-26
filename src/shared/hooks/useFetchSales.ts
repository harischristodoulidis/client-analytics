import { useQuery } from "@tanstack/react-query";
import { fetchRecentSales } from "../api/salesApi";

export const useFetchSales = (limit = 5) => {
  const query = useQuery({
    queryKey: ["sales", limit],
    queryFn: () => fetchRecentSales(limit),
  });

  return query;
};
