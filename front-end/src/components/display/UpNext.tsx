"use client";

import { useEffect } from "react";
import { useFetch } from "@/src/features/display/hooks/useFetch";
import type { UpNextResponse } from "@/src/features/display/types/display.types";

export default function UpNext() {
  const { data: upNext, load: loadUpNext } =
    useFetch<UpNextResponse>("/display/up-next");

  useEffect(() => {
    loadUpNext();
  }, [loadUpNext]);

  const items = upNext?.data ?? [];

  return (
    <>
      <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40 mt-2">
        Up Next
      </div>

      <div className="grid grid-cols-6 gap-2.5 flex-1 overflow-hidden">
        {items.length > 0 ? (
          items.map((g, i) => (
            <div
              key={g.ticketNumber}
              className="bg-white/5 border border-white/10 rounded-[14px] p-4"
            >
              <div className="font-serif text-2xl text-white leading-none">
                {g.ticketNumber}
              </div>

              <div className="text-xs text-white/50 mt-1">
                {g.guestName || "Unknown Guest"}
              </div>

              <div className="text-[11px] mt-1 font-medium text-brand-mid">
                ~{g.waitingMinutes ?? 0} min
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-6 text-xs text-white/30">
            No upcoming guests
          </div>
        )}
      </div>
    </>
  );
}
