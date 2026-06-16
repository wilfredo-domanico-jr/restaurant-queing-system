import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const json = await apiClient<T>(endpoint);

      setData(json);
      return json;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, load, loading };
}
