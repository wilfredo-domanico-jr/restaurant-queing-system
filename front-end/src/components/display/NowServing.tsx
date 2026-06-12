"use client";

import { useEffect } from "react";
import { useFetch } from "@/src/features/display/hooks/useFetch";
import type { NowServingResponse } from "@/src/features/display/types/display.types";

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
      <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40">
        Now Serving
      </div>

      <div className="bg-gradient-to-br from-[#2A1A0E] to-[#1F1308] border border-brand/30 rounded-2xl p-10 flex flex-col sm:flex-row items-center gap-8">
        <div className="font-serif text-8xl text-white leading-none">
          {data?.ticketNumber ?? "—"}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="text-[clamp(1.2rem,3vw,1.8rem)] font-semibold text-white mb-1">
            {data?.guestName ?? "Waiting for guests…"}
          </div>

          <div className="text-sm text-white/50">
            {data
              ? `Party of ${data.partySize} · ${timeString}`
              : "Please wait"}
          </div>

          {data?.section && (
            <span className="inline-block bg-brand text-white text-[11px] font-semibold px-3 py-1 rounded-full tracking-[1px] uppercase mt-2.5">
              {data.section}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
