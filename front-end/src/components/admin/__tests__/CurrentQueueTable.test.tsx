import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrentQueueTable from "../CurrentQueueTable";
import type { CurrentQueueItem } from "@/src/types/admin.types";

const waitingItem: CurrentQueueItem = {
  id: 1,
  ticketNumber: "T001",
  guestName: "Ada Lovelace",
  partySize: 2,
  section: "Indoor",
  waitingMinutes: 5,
  joinedAt: new Date().toISOString(),
  status: "Waiting",
};

const calledItem: CurrentQueueItem = {
  ...waitingItem,
  id: 2,
  ticketNumber: "T002",
  guestName: "Grace Hopper",
  status: "Called",
};

describe("CurrentQueueTable", () => {
  it("renders a row per queue item", () => {
    render(
      <CurrentQueueTable
        showToast={vi.fn()}
        queueData={[waitingItem, calledItem]}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
        deletingId={null}
      />,
    );

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("calls onUpdate with 'Called' when a waiting ticket is called", () => {
    const onUpdate = vi.fn();
    render(
      <CurrentQueueTable
        showToast={vi.fn()}
        queueData={[waitingItem]}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
        deletingId={null}
      />,
    );

    fireEvent.click(screen.getByText("Call"));

    expect(onUpdate).toHaveBeenCalledWith(1, "Called");
  });

  it("calls onUpdate with 'Seated' and 'No-Show' for a called ticket", () => {
    const onUpdate = vi.fn();
    render(
      <CurrentQueueTable
        showToast={vi.fn()}
        queueData={[calledItem]}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
        deletingId={null}
      />,
    );

    fireEvent.click(screen.getByText("Seat"));
    expect(onUpdate).toHaveBeenCalledWith(2, "Seated");

    fireEvent.click(screen.getByText("No-show"));
    expect(onUpdate).toHaveBeenCalledWith(2, "No-Show");
  });

  it("calls onDelete for a waiting ticket's remove button", () => {
    const onDelete = vi.fn();
    render(
      <CurrentQueueTable
        showToast={vi.fn()}
        queueData={[waitingItem]}
        onDelete={onDelete}
        onUpdate={vi.fn()}
        deletingId={null}
      />,
    );

    fireEvent.click(screen.getByText("✕"));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
