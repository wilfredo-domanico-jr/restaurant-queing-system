import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function useDelete<T>(endpoint: string) {
  const [loading, setLoading] = useState(false);

  const remove = useCallback(
    async (id: number) => {
      try {
        setLoading(true);

        const json = await apiClient<T>(`${endpoint}?id=${id}`, {
          method: "DELETE",
        });

        return json;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return { remove, loading };
}
