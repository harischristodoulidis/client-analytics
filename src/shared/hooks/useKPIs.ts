import { useQuery } from "@tanstack/react-query";
import { fetchMockKPIs } from "../api/revenueApi";

export const useKPIs = (period: string | { from: Date; to: Date } = "1y") => {
  return useQuery({
    queryKey: ["kpis", period],
    queryFn: () => fetchMockKPIs(period),
  });
};
