import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePost } from "../usePost";
import { apiClient } from "@/src/lib/apiClient";

vi.mock("@/src/lib/apiClient", () => ({ apiClient: vi.fn() }));

describe("usePost", () => {
  beforeEach(() => {
    vi.mocked(apiClient).mockReset();
  });

  it("posts the body as JSON to the endpoint", async () => {
    vi.mocked(apiClient).mockResolvedValue({ message: "ok" });
    const { result } = renderHook(() => usePost("/kiosk/create-ticket"));

    await act(async () => {
      await result.current.post({ guestName: "Ada" });
    });

    expect(apiClient).toHaveBeenCalledWith("/kiosk/create-ticket", {
      method: "POST",
      body: JSON.stringify({ guestName: "Ada" }),
    });
    expect(result.current.loading).toBe(false);
  });
});
