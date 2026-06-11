import { apiClient } from "@/src/lib/apiClient";
import { SectionStatusResponse } from "../types/section-status.types";

// FETCH SECTION STATUS
export const fetchSectionStatus = async (): Promise<SectionStatusResponse> => {
  return apiClient<SectionStatusResponse>("/display/sections-status", {
    method: "GET",
  });
};
