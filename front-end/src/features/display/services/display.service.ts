import { apiClient } from "@/src/lib/apiClient";
import {
  SectionStatusResponse,
  TodayStatsResponse,
  NowServingResponse,
} from "../types/display.types";

// FETCH SECTION STATUS
export const fetchSectionStatus = async (): Promise<SectionStatusResponse> => {
  return apiClient<SectionStatusResponse>("/display/sections-status", {
    method: "GET",
  });
};

// FETCH TODAY'S STATS
export const fetchTodayStats = async (): Promise<TodayStatsResponse> => {
  return apiClient<TodayStatsResponse>("/display/stats-today", {
    method: "GET",
  });
};

// FETCH NOW SERVING
export const fetchNowServing = async (): Promise<NowServingResponse> => {
  return apiClient<NowServingResponse>("/display/now-serving", {
    method: "GET",
  });
};
