import { useEffect } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import type { CurrentQueueResponse } from "@/src/types/admin.types";
import CurrentQueueTable from "./CurrentQueueTable";

type CurrentQueueProps = {
  totalGuest: number;
};

export default function CurrentQueue({ totalGuest }: CurrentQueueProps) {
  const { data: currentQueue, load: loadCurrentQueue } =
    useFetch<CurrentQueueResponse>("/admin/current-queue");

  useEffect(() => {
    loadCurrentQueue();
  }, [loadCurrentQueue]);

  const queueData = currentQueue?.data ?? [];
  const hasGuests = queueData.length > 0;

  return (
    <div className="col-span-4">
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-4 px-5 border-b border-border flex items-center justify-between">
          <div className="font-semibold text-sm text-text">Current Queue</div>

          <div className="bg-brand-light text-brand text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {totalGuest} {totalGuest === 1 ? "guest" : "guests"}
          </div>
        </div>

        {/* BODY */}
        {hasGuests ? (
          <CurrentQueueTable queueData={queueData} />
        ) : (
          <div className="p-12 text-center text-text-muted text-sm">
            <div className="text-4xl mb-2">🎉</div>
            No guests currently in queue
          </div>
        )}
      </div>
    </div>
  );
}
