"use client";

type TicketModalProps = {
  ticketNumber: string;
  guestName: string;
  partySize: number;
  section: string;
  positionInQueue: number;
  estimatedWaitMinutes: number;
  onClose: () => void;
};

export default function TicketModal({
  ticketNumber,
  guestName,
  partySize,
  section,
  positionInQueue,
  estimatedWaitMinutes,
  onClose,
}: TicketModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-xs max-w-md overflow-hidden animate-[fadeIn_0.2s_ease]">
        {/* HEADER */}
        <div className="bg-brand p-6 text-center relative">
          <div className="text-white/80 text-sm font-semibold">
            Saveur Restaurant
          </div>

          <div className="text-white text-6xl font-serif mt-2">
            {ticketNumber}
          </div>
        </div>

        {/* BODY */}
        <div className="pt-6 px-8 pb-8">
          {/* WAIT */}
          <div className="text-center my-5 bg-brand-light rounded-xl p-4">
            <div className="font-serif text-[2.5rem] text-brand">
              {estimatedWaitMinutes}
            </div>
            <div className="text-[13px] text-brand font-medium">
              estimated wait (minutes)
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2 border-border">
              <span className="text-[13px] text-gray-500">Guest name</span>
              <span className="text-[13px] font-semibold">{guestName}</span>
            </div>

            <div className="flex justify-between border-b pb-2 border-border">
              <span className="text-[13px] text-gray-500">Party size</span>
              <span className="text-[13px] font-semibold">
                {partySize} {partySize === 1 ? "guest" : "guests"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2 border-border">
              <span className="text-[13px] text-gray-500">Section</span>
              <span className="text-[13px] font-semibold">{section}</span>
            </div>

            <div className="flex justify-between pb-2 border-border">
              <span className="text-[13px] text-gray-500">Position</span>
              <span className="text-[13px] font-semibold">
                #{positionInQueue} in queue
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={onClose}
            className="w-full mt-6 bg-brand text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition cursor-pointer"
          >
            Got it, I'll wait!
          </button>
        </div>
      </div>
    </div>
  );
}
