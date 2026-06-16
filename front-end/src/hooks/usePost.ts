import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function usePost<T, B = any>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const post = useCallback(
    async (body: B) => {
      try {
        setLoading(true);

        const json = await apiClient<T>(endpoint, {
          method: "POST",
          body: JSON.stringify(body),
        });

        setData(json);
        return json;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return { post, loading };
}
