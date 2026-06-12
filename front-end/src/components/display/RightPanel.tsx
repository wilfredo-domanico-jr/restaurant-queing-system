"use client";

import { useEffect } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import type {
  TodayStatsResponse,
  SectionStatusResponse,
} from "@/src/types/display.types";
import SectionRow from "./SectionRow";

export default function RightPanel() {
  const { data: stats, load: loadTodayStats } = useFetch<TodayStatsResponse>(
    "/display/stats-today",
  );

  const { data: status, load: loadSectionStatus } =
    useFetch<SectionStatusResponse>("/display/sections-status");

  useEffect(() => {
    loadTodayStats();
    loadSectionStatus();
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
            {stats?.data?.waiting ?? 0}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Seated today</span>
          <span className="text-sm font-semibold text-white">
            {stats?.data?.seated ?? 0}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Avg. wait time</span>
          <span className="text-sm font-semibold text-white">
            {stats?.data?.averageWaitingTime ?? "—"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-white/50">Tickets issued</span>
          <span className="text-sm font-semibold text-white">
            {stats?.data?.issued ?? 0}
          </span>
        </div>
      </div>

      <div className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 pb-2 border-b border-white/10 mt-2">
        By Section
      </div>

      <div className="flex flex-col gap-2">
        <SectionRow name="Indoor" waiting={status?.data?.indoor ?? 0} />
        <SectionRow name="Outdoor" waiting={status?.data?.outdoor ?? 0} />
        <SectionRow name="Bar" waiting={status?.data?.bar ?? 0} />
        <SectionRow name="VIP" waiting={status?.data?.vip ?? 0} />
      </div>

      <div className="bg-brand/15 rounded-xl p-3.5 text-[13px] text-brand-mid leading-relaxed">
        🍽 Welcome to Saveur — please proceed to the host stand when your number
        is called.
      </div>
    </div>
  );
}
