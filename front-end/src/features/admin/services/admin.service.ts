import { apiClient } from "@/src/lib/apiClient";
import { TodayStatsResponse } from "../types/admin.types";

// FETCH TODAY'S STATS
export const fetchTodayStats = async (): Promise<TodayStatsResponse> => {
  return apiClient<TodayStatsResponse>("/display/stats-today", {
    method: "GET",
  });
};
