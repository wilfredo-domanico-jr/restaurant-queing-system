"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import type { UpNextResponse } from "@/src/types/display.types";

export default function UpNext() {
  const [upNext, setUpNext] = useState<UpNextResponse | null>(null);

  const { load: loadUpNext } = useFetch<UpNextResponse>("/display/up-next");

  useEffect(() => {
    loadUpNext();
  }, [loadUpNext]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadUpNext();
      setUpNext(result);
    };

    fetchData();
  }, [loadUpNext]);

  const items = upNext?.data ?? [];

  return (
    <>
      {/* LABEL */}
      <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40 mt-2">
        Up Next
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 flex-1 overflow-hidden">
        {items.length > 0 ? (
          items.map((g) => (
            <div
              key={g.ticketNumber}
              className="bg-white/5 border border-white/10 max-h-40 rounded-[14px] p-3 sm:p-4"
            >
              {/* TICKET */}
              <div className="font-serif text-xl sm:text-2xl text-white leading-none">
                {g.ticketNumber}
              </div>

              {/* NAME */}
              <div className="text-xs text-white/50 mt-1 truncate">
                {g.guestName || "Unknown Guest"}
              </div>

              {/* WAIT */}
              <div className="text-[11px] mt-1 font-medium text-brand-mid">
                ~{g.waitingMinutes ?? 0} min
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-xs text-white/30">
            No upcoming guests
          </div>
        )}
      </div>
    </>
  );
}
