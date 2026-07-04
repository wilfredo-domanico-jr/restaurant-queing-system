import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePatch } from "../usePatch";
import { apiClient } from "@/src/lib/apiClient";

vi.mock("@/src/lib/apiClient", () => ({ apiClient: vi.fn() }));

describe("usePatch", () => {
  beforeEach(() => {
    vi.mocked(apiClient).mockReset();
  });

  it("patches with the id in the query string and body as JSON", async () => {
    vi.mocked(apiClient).mockResolvedValue({ message: "ok" });
    const { result } = renderHook(() => usePatch("/admin/update-queue-status"));

    await act(async () => {
      await result.current.patch(5, { status: "Called" });
    });

    expect(apiClient).toHaveBeenCalledWith("/admin/update-queue-status?id=5", {
      method: "PATCH",
      body: JSON.stringify({ status: "Called" }),
    });
  });
});
