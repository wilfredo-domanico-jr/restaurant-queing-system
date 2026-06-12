import type { CurrentQueueItem } from "@/src/types/admin.types";

type CurrentQueueProps = {
  queueData: CurrentQueueItem[];
  onDelete: (id: number) => Promise<any>;
  deletingId: number | null;
};

export default function CurrentQueueTable({
  queueData,
  onDelete,
  deletingId,
}: CurrentQueueProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              #
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Guest
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Party
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Section
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Joined
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Wait
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Status
            </th>
            <th className="text-left text-[11px] text-text-muted font-semibold uppercase tracking-[0.8px] px-4 py-2 border-b border-border bg-[#FDFAF8]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {queueData.map((item) => (
            <tr key={item.id} className="hover:bg-cream">
              <td className="px-4 py-3 border-b border-[#F5EDE8]">
                <span className="font-serif text-xl text-text">
                  {item.ticketNumber}
                </span>
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8]">
                <span className="font-medium text-[13px]">
                  {item.guestName}
                </span>
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8] text-[13px]">
                {item.partySize}
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8]">
                <span className="text-[11px] bg-brand-light text-brand px-2 py-[3px] rounded font-semibold">
                  {item.section}
                </span>
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8] text-[13px] text-text-muted">
                {new Date(item.joinedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8] text-[13px] text-text-muted">
                {item.waitingMinutes}m
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8]">
                <span className="inline-block text-[11px] font-semibold px-2.5 py-[3px] rounded bg-[#FEF9C3] text-[#854D0E]">
                  {item.status}
                </span>
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8]">
                <div className="flex gap-1.5">
                  {item.status === "Waiting" ? (
                    <button className="cursor-pointer px-2.5 py-1 rounded text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] cursor-pointers">
                      Call
                    </button>
                  ) : item.status === "Called" ? (
                    <button className="cursor-pointer px-2.5 py-1 rounded text-[11px] font-semibold bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE]">
                      Seat
                    </button>
                  ) : null}

                  <button
                    onClick={() => onDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
