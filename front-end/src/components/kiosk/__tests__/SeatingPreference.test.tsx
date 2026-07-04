import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SeatingPreference from "../SeatingPreference";

describe("SeatingPreference", () => {
  it("renders all four sections", () => {
    render(<SeatingPreference section="" setSection={vi.fn()} />);

    expect(screen.getByText("Indoor")).toBeInTheDocument();
    expect(screen.getByText("Outdoor")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
  });

  it("calls setSection with the clicked section's name", () => {
    const setSection = vi.fn();
    render(<SeatingPreference section="" setSection={setSection} />);

    fireEvent.click(screen.getByText("Outdoor"));

    expect(setSection).toHaveBeenCalledWith("Outdoor");
  });
});
