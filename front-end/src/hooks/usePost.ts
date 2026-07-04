import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function usePost<T, B = unknown>(endpoint: string) {
  const [loading, setLoading] = useState(false);

  const post = useCallback(
    async (body: B) => {
      try {
        setLoading(true);

        const json = await apiClient<T>(endpoint, {
          method: "POST",
          body: JSON.stringify(body),
        });

        return json;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return { post, loading };
}
