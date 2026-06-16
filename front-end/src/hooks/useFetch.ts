import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function useFetch<T>(endpoint: string) {
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const json = await apiClient<T>(endpoint);

      return json;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { load, loading };
}
