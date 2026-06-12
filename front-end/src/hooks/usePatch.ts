import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function usePatch<T, B = any>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = useCallback(
    async (id: number, body: B) => {
      try {
        setLoading(true);
        setError(null);

        const json = await apiClient<T>(`${endpoint}?id=${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        setData(json);
        return json;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return { patch, data, loading, error };
}
