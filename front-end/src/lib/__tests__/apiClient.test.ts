import { describe, it, expect, vi, beforeEach } from "vitest";

describe("apiClient", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:5272/api");
    vi.stubEnv("NEXT_PUBLIC_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn());
  });

  it("routes non-admin endpoints to the backend with the API key header", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);
    const { apiClient } = await import("../apiClient");

    await apiClient("/kiosk/stats");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5272/api/kiosk/stats",
      expect.objectContaining({
        headers: expect.objectContaining({ "x-api-key": "test-key" }),
        credentials: "same-origin",
      }),
    );
  });

  it("routes admin endpoints through the local proxy with credentials and no api key", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);
    const { apiClient } = await import("../apiClient");

    await apiClient("/admin/stats-today");

    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api/admin/stats-today");
    expect(options?.credentials).toBe("include");
    expect((options?.headers as Record<string, string>)["x-api-key"]).toBeUndefined();
  });

  it("throws on a non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      text: async () => "Bad request",
    } as Response);
    const { apiClient } = await import("../apiClient");

    await expect(apiClient("/kiosk/stats")).rejects.toThrow("Bad request");
  });
});
