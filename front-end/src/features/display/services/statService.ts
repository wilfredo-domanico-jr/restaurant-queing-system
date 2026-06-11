import { apiClient } from "@/src/lib/apiClient";
import { TodayStatsResponse } from "../types/today-stats.types";

// FETCH TODAY'S STATS
export const fetchTodayStats = async (): Promise<TodayStatsResponse> => {
  return apiClient<TodayStatsResponse>("/stats/today", {
    method: "GET",
  });
};
