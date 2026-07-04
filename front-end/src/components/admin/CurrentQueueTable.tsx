import type { CurrentQueueItem } from "@/src/types/admin.types";

type CurrentQueueProps = {
  showToast: (message: string) => void;
  queueData: CurrentQueueItem[];
  onDelete: (id: number) => Promise<unknown>;
  onUpdate: (id: number, status: string) => Promise<unknown>;
  deletingId: number | null;
};

export default function CurrentQueueTable({
  showToast,
  queueData,
  onDelete,
  onUpdate,
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
                <span
                  className={`inline-block text-[11px] font-semibold px-2.5 py-[3px] rounded
      ${
        item.status === "Waiting"
          ? "bg-[#FEF9C3] text-[#854D0E]"
          : item.status === "Called"
            ? "bg-[#DCFCE7] text-[#166534]"
            : "bg-gray-200 text-gray-600"
      }
    `}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-4 py-3 border-b border-[#F5EDE8]">
                <div className="flex gap-1.5">
                  {/* Start Called and Seated Buttons */}
                  {item.status === "Waiting" ? (
                    <button
                      onClick={() => {
                        onUpdate(item.id, "Called");
                        showToast(
                          `📣 Now calling: ${item.ticketNumber} — ${item.guestName}`,
                        );
                      }}
                      className="cursor-pointer px-2.5 py-1 rounded text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] cursor-pointers"
                    >
                      Call
                    </button>
                  ) : item.status === "Called" ? (
                    <button
                      onClick={() => {
                        onUpdate(item.id, "Seated");
                        showToast(`✅ ${item.guestName} seated`);
                      }}
                      className="cursor-pointer px-2.5 py-1 rounded text-[11px] font-semibold bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE]"
                    >
                      Seat
                    </button>
                  ) : null}
                  {/* End Called and Seated Buttons */}

                  {/* Start Delete or No-Show Button */}
                  {item.status === "Called" ? (
                    <button
                      onClick={() => {
                        onUpdate(item.id, "No-Show");
                        showToast(`❌ ${item.guestName} marked no-show`);
                      }}
                      className="cursor-pointer px-2.5 py-1 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA]"
                    >
                      No-show
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onDelete(item.id);
                        showToast(`Removed ${item.guestName} from queue`);
                      }}
                      disabled={deletingId === item.id}
                      className="cursor-pointer px-2.5 py-1 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA]"
                    >
                      ✕
                    </button>
                  )}

                  {/* End Delete or No-Show Button */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
