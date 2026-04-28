import { useQuery } from "@tanstack/react-query";
import { fetchRecentSales } from "../api/salesApi";

export const useFetchSales = (limit = 5, offset = 0) => {
  const query = useQuery({
    queryKey: ["sales", limit, offset],
    queryFn: () => fetchRecentSales(limit, offset),
  });

  return query;
};
