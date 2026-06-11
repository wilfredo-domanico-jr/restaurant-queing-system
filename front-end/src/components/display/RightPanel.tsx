"use client";

import { useEffect } from "react";
import { useFetchTodayStats } from "@/src/features/display/hooks/useFetchTodayStats";

export default function RightPanel() {
  const { data: stats, loadTodayStats } = useFetchTodayStats();

  useEffect(() => {
    loadTodayStats();
  }, []);

  return (
    <div className="hidden md:flex bg-white/[0.03] border-l border-white/10 p-6 flex-col gap-5 overflow-y-auto">
      <div className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 pb-2 border-b border-white/10">
        Today's Stats
      </div>

      <div>
        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Currently waiting</span>
          <span className="text-sm font-semibold text-white">
            {stats?.waiting ?? 0}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Seated today</span>
          <span className="text-sm font-semibold text-white">
            {stats?.seated ?? 0}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Avg. wait time</span>
          <span className="text-sm font-semibold text-white">
            {stats?.averageWaitingTime ?? "—"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Tickets issued</span>
          <span className="text-sm font-semibold text-white">
            {stats?.issued ?? 0}
          </span>
        </div>
      </div>

      <div className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 pb-2 border-b border-white/10 mt-2">
        By Section
      </div>

      <div className="bg-brand/15 rounded-xl p-3.5 text-xs text-brand-mid leading-relaxed">
        🍽 Welcome to Saveur — please proceed to the host stand when your number
        is called.
      </div>
    </div>
  );
}
