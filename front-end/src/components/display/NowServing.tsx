"use client";

import { useEffect } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import type { NowServingResponse } from "@/src/types/display.types";

export default function NowServing() {
  const { data: nowServing, load: loadNowServing } =
    useFetch<NowServingResponse>("/display/now-serving");

  useEffect(() => {
    loadNowServing();
  }, [loadNowServing]);

  const data = nowServing?.data;

  const timeString = data
    ? new Date(data.joinedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      {/* LABEL */}
      <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40">
        Now Serving
      </div>

      {/* CARD */}
      <div className="bg-gradient-to-br from-[#2A1A0E] to-[#1F1308] border border-brand/30 rounded-2xl p-5 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {/* TICKET */}
        <div className="font-serif text-5xl sm:text-7xl md:text-8xl text-white leading-none text-center sm:text-left">
          {data?.ticketNumber ?? "—"}
        </div>

        {/* INFO */}
        <div className="flex-1 text-center sm:text-left w-full">
          {/* NAME */}
          <div className="text-xl sm:text-2xl md:text-[clamp(1.2rem,3vw,1.8rem)] font-semibold text-white mb-1">
            {data?.guestName ?? "Waiting for guests…"}
          </div>

          {/* DETAILS */}
          <div className="text-xs sm:text-sm text-white/50">
            {data
              ? `Party of ${data.partySize} · ${timeString}`
              : "Please wait"}
          </div>

          {/* SECTION */}
          {data?.section && (
            <span className="inline-block bg-brand text-white text-[10px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-1 rounded-full tracking-[1px] uppercase mt-3">
              {data.section}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
