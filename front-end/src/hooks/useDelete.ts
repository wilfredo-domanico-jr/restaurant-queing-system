import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function useDelete<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const json = await apiClient<T>(`${endpoint}?id=${id}`, {
          method: "DELETE",
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

  return { remove, data, loading, error };
}
