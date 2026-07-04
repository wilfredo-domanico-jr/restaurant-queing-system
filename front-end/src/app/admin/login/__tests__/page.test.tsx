import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

describe("AdminLogin page", () => {
  beforeEach(() => {
    vi.resetModules();
    pushMock.mockClear();
    refreshMock.mockClear();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("does not show the demo button when demo mode is off", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "false");
    const { default: AdminLogin } = await import("../page");

    render(<AdminLogin />);

    expect(screen.queryByText("Continue as Demo Admin")).not.toBeInTheDocument();
  });

  it("shows the demo button and logs in with the demo credentials", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
    vi.stubEnv("NEXT_PUBLIC_DEMO_ADMIN_USERNAME", "admin");
    vi.stubEnv("NEXT_PUBLIC_DEMO_ADMIN_PASSWORD", "demo-pass");
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const { default: AdminLogin } = await import("../page");
    render(<AdminLogin />);

    fireEvent.click(screen.getByText("Continue as Demo Admin"));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          body: JSON.stringify({ username: "admin", password: "demo-pass" }),
        }),
      ),
    );
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin"));
  });

  it("submits typed credentials via the regular form", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "false");
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const { default: AdminLogin } = await import("../page");
    const { container } = render(<AdminLogin />);

    const usernameInput = container.querySelector('input[type="text"]')!;
    const passwordInput = container.querySelector('input[type="password"]')!;

    fireEvent.change(usernameInput, { target: { value: "myuser" } });
    fireEvent.change(passwordInput, { target: { value: "mypass" } });
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          body: JSON.stringify({ username: "myuser", password: "mypass" }),
        }),
      ),
    );
  });

  it("shows an error message when login fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "false");
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    const { default: AdminLogin } = await import("../page");
    const { container } = render(<AdminLogin />);

    fireEvent.change(container.querySelector('input[type="text"]')!, {
      target: { value: "wrong" },
    });
    fireEvent.change(container.querySelector('input[type="password"]')!, {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByText("Sign in"));

    expect(await screen.findByText("Invalid username or password")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
