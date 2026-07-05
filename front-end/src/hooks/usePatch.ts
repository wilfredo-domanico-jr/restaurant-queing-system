import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";

export function usePatch<T, B = unknown>(endpoint: string) {
  const [loading, setLoading] = useState(false);

  const patch = useCallback(
    async (id: number, body: B) => {
      try {
        setLoading(true);
        const json = await apiClient<T>(`${endpoint}?id=${id}`, {
          method: "PATCH",
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        return json;
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return { patch, loading };
}
