import { useState } from "react";
import { fetchSectionStatus } from "../services/sectionStatusService";
import { SectionStatusResponse } from "../types/section-status.types";

type SectionStatus = SectionStatusResponse["data"];

export function useFetchSectionStatus() {
  const [data, setData] = useState<SectionStatus | null>(null);

  const loadSectionStatus = async () => {
    try {
      const result = await fetchSectionStatus();

      console.log("Fetch Result", result.message);

      setData(result.data);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { data, loadSectionStatus };
}
