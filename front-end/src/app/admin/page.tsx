"use client";

import { useEffect } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import type { TodayStatsResponse } from "@/src/types/admin.types";
import CurrentQueue from "@/src/components/admin/CurrentQueue";
import Header from "@/src/components/admin/Header";
import Sidebar from "@/src/components/admin/Sidebar";
import StatsCard from "@/src/components/admin/StatCard";

export default function Admin() {
  const { data: todayStats, load: loadTodayStats } =
    useFetch<TodayStatsResponse>("/admin/stats-today");

  useEffect(() => {
    loadTodayStats();
  }, []);

  const refreshTodayStats = async () => {
    await loadTodayStats();
  };

  const stats = todayStats?.data;
  const totalGuest = (stats?.waiting ?? 0) + (stats?.called ?? 0);

  function simulateJoin() {
    console.log("Simulate guest clicked");
  }

  function callNext() {
    console.log("Call next clicked");
  }

  return (
    <div className="h-auto bg-[#F9F5F1]">
      {/* HEADER */}
      <Header simulateJoin={simulateJoin} callNext={callNext} />

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
          totalGuest={totalGuest}
          refreshTodayStats={refreshTodayStats}
        />
        <Sidebar />
      </div>
    </div>
  );
}
