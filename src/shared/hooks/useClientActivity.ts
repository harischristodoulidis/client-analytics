import { useQuery } from "@tanstack/react-query";
import { fetchClientActivity } from "../api/activityLogApi";

export const useClientActivity = (clientId: string, limit = 5) => {
  return useQuery({
    queryKey: ["activity", clientId, limit],
    queryFn: () => fetchClientActivity(clientId, limit),
    enabled: !!clientId,
  });
};
