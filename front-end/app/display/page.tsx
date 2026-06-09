"use client";

import { useEffect, useState } from "react";

export default function Display() {
  const [time, setTime] = useState("00:00:00");

  // simple clock (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#1A1108]">
      {/* HEADER */}
      <div className="border-b border-white/10 py-5 px-8 flex items-center justify-between">
        <div className="font-serif text-2xl text-white">
          Saveur <em className="text-brand-mid italic">Queue</em>
        </div>

        <div className="text-lg font-light text-white/50 tabular-nums">
          {time}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] h-[calc(100vh-56px-69px)]">
        {/* LEFT SIDE */}
        <div className="p-8 flex flex-col gap-6 overflow-hidden">
          <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40">
            Now Serving
          </div>

          <div className="bg-gradient-to-br from-[#2A1A0E] to-[#1F1308] border border-brand/30 rounded-2xl p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="font-serif text-[clamp(4rem,10vw,7rem)] text-white leading-none">
              —
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="text-[clamp(1.2rem,3vw,1.8rem)] font-semibold text-white mb-1">
                Waiting for guests…
              </div>

              <div className="text-sm text-white/50">Please wait</div>
            </div>
          </div>

          <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40 mt-2">
            Up Next
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 flex-1 overflow-hidden"></div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden md:flex bg-white/[0.03] border-l border-white/10 p-6 flex-col gap-5 overflow-y-auto">
          <div className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 pb-2 border-b border-white/10">
            Today's Stats
          </div>

          <div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-white/50">Currently waiting</span>
              <span className="text-sm font-semibold text-white">0</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-white/50">Seated today</span>
              <span className="text-sm font-semibold text-white">0</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-white/50">Avg. wait time</span>
              <span className="text-sm font-semibold text-white">—</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-white/50">Tickets issued</span>
              <span className="text-sm font-semibold text-white">0</span>
            </div>
          </div>

          <div className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 pb-2 border-b border-white/10 mt-2">
            By Section
          </div>

          <div className="flex flex-col gap-2"></div>

          <div className="bg-brand/15 rounded-xl p-3.5 text-xs text-brand-mid leading-relaxed">
            🍽 Welcome to Saveur — please proceed to the host stand when your
            number is called.
          </div>
        </div>
      </div>
    </div>
  );
}
