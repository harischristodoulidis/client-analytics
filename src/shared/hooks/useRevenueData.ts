import { useQuery } from "@tanstack/react-query";
import { fetchRevenueData } from "../api/revenueApi";

export const useRevenueData = (
  period: string | { from: Date; to: Date } = "1y",
) => {
  return useQuery({
    queryKey: ["revenue", period],
    queryFn: () => fetchRevenueData(period),
  });
};
