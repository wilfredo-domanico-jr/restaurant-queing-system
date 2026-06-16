"use client";

import { useEffect, useState, useRef } from "react";
import { useFetch } from "@/src/hooks/useFetch";

import type {
  TodayStatsResponse,
  SectionStatusResponse,
  RecentActivityResponse,
} from "@/src/types/admin.types";
import CurrentQueue from "@/src/components/admin/CurrentQueue";
import Header from "@/src/components/admin/Header";
import Sidebar from "@/src/components/admin/Sidebar";
import StatsCard from "@/src/components/admin/StatCard";

export default function Admin() {
  const { data: todayStats, load: loadTodayStats } =
    useFetch<TodayStatsResponse>("/admin/stats-today");

  const { data: sections, load: loadSectionStatus } =
    useFetch<SectionStatusResponse>("/admin/sections-status");

  const { data: recentActivity, load: loadRecentActivity } =
    useFetch<RecentActivityResponse>("/admin/activity-logs");

  useEffect(() => {
    loadTodayStats();
    loadSectionStatus();
    loadRecentActivity();
  }, []);

  console.log(todayStats?.message);
  console.log(sections?.message);
  console.log(recentActivity?.message);

  const refreshTodayStats = async () => {
    await loadTodayStats();
    await loadSectionStatus();
    await loadRecentActivity();
  };

  const stats = todayStats?.data;
  const sectionsData = sections?.data ?? {
    indoor: 0,
    outdoor: 0,
    bar: 0,
    vip: 0,
  };
  const recentActivityData = recentActivity?.data ?? [];
  const totalGuest = (stats?.waiting ?? 0) + (stats?.called ?? 0);

  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, visible: true });

    timerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));

      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 300);
    }, 2800);
  }



  return (
    <div className="h-auto bg-[#F9F5F1]">
      {/* HEADER */}
      <Header />

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 sm:p-6">
        <StatsCard
          label="Waiting"
          value={stats?.waiting ?? 0}
          sub="in queue"
          highlight={true}
        />
        <StatsCard
          label="Called"
          value={stats?.called ?? 0}
          sub="being seated"
        />
        <StatsCard label="Seated" value={stats?.seated ?? 0} sub="today" />
        <StatsCard label="No-shows" value={stats?.noShow ?? 0} sub="today" />
        <StatsCard
          label="Avg. Wait"
          value={Math.round(stats?.averageWaitingTime ?? 0)}
          sub="minutes"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 px-4 sm:px-6 pb-6">
        <CurrentQueue
          showToast={showToast}
          totalGuest={totalGuest}
          refreshTodayStats={refreshTodayStats}
        />
        <Sidebar
          recentActivity={recentActivityData}
          sectionsData={sectionsData}
        />
      </div>

      <div
        className={`fixed bottom-6 right-6 bg-text text-white px-5 py-3 rounded-xl text-xs font-medium z-[200] max-w-[300px] transition-all duration-300
    ${toast?.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
  `}
      >
        {toast?.message}
      </div>
    </div>
  );
}
