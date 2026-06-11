import { useState } from "react";
import { fetchTodayStats } from "@/src/features/display/services/statService";
import { TodayStatsResponse } from "../types/today-stats.types";

type TodayStats = TodayStatsResponse["data"];

export function useFetchTodayStats() {
  const [data, setData] = useState<TodayStats | null>(null);

  const loadTodayStats = async () => {
    try {
      const result = await fetchTodayStats();

      setData(result.data);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { data, loadTodayStats };
}
