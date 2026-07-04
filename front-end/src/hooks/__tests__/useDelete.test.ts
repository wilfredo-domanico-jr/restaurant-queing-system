import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDelete } from "../useDelete";
import { apiClient } from "@/src/lib/apiClient";

vi.mock("@/src/lib/apiClient", () => ({ apiClient: vi.fn() }));

describe("useDelete", () => {
  beforeEach(() => {
    vi.mocked(apiClient).mockReset();
  });

  it("deletes with the id in the query string", async () => {
    vi.mocked(apiClient).mockResolvedValue({ message: "ok" });
    const { result } = renderHook(() => useDelete("/admin/delete-queue"));

    await act(async () => {
      await result.current.remove(7);
    });

    expect(apiClient).toHaveBeenCalledWith("/admin/delete-queue?id=7", {
      method: "DELETE",
    });
  });
});
