import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFetch } from "../useFetch";
import { apiClient } from "@/src/lib/apiClient";

vi.mock("@/src/lib/apiClient", () => ({ apiClient: vi.fn() }));

describe("useFetch", () => {
  beforeEach(() => {
    vi.mocked(apiClient).mockReset();
  });

  it("calls apiClient with the given endpoint and returns the result", async () => {
    vi.mocked(apiClient).mockResolvedValue({ data: "ok" });
    const { result } = renderHook(() => useFetch("/kiosk/stats"));

    let response;
    await act(async () => {
      response = await result.current.load();
    });

    expect(apiClient).toHaveBeenCalledWith("/kiosk/stats");
    expect(response).toEqual({ data: "ok" });
    expect(result.current.loading).toBe(false);
  });
});
