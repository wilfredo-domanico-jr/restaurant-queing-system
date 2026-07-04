import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const onMock = vi.fn();
const startMock = vi.fn().mockResolvedValue(undefined);
const stopMock = vi.fn();
const withUrlMock = vi.fn();
const withAutomaticReconnectMock = vi.fn();
const buildMock = vi.fn();

vi.mock("@microsoft/signalr", () => {
  class HubConnectionBuilder {
    withUrl(...args: unknown[]) {
      withUrlMock(...args);
      return this;
    }
    withAutomaticReconnect() {
      withAutomaticReconnectMock();
      return this;
    }
    build() {
      buildMock();
      return { on: onMock, start: startMock, stop: stopMock };
    }
  }
  return { HubConnectionBuilder };
});

describe("useQueueUpdates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:5272/api");
  });

  it("connects to the hub with credentials disabled and forwards queueUpdated events", async () => {
    const { useQueueUpdates } = await import("../useQueueUpdates");
    const onUpdate = vi.fn();

    const { unmount } = renderHook(() => useQueueUpdates(onUpdate));

    expect(withUrlMock).toHaveBeenCalledWith("http://localhost:5272/hubs/queue", {
      withCredentials: false,
    });
    expect(onMock).toHaveBeenCalledWith("queueUpdated", expect.any(Function));
    expect(startMock).toHaveBeenCalled();

    const [, handler] = onMock.mock.calls[0];
    handler();
    expect(onUpdate).toHaveBeenCalled();

    unmount();
    expect(stopMock).toHaveBeenCalled();
  });
});
