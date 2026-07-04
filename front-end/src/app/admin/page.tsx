"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import { useQueueUpdates } from "@/src/hooks/useQueueUpdates";

import type {
  TodayStatsResponse,
  SectionStatusResponse,
  RecentActivityResponse,
} from "@/src/types/admin.types";
import CurrentQueue from "@/src/components/admin/CurrentQueue";
import Header from "@/src/components/admin/Header";
import Sidebar from "@/src/components/admin/Sidebar";
import StatsCard from "@/src/components/admin/StatCard";
import { useToast } from "@/src/providers/ToastProvider";

export default function Admin() {
  const [todayStats, setTodayStats] = useState<TodayStatsResponse | null>(null);

  const [sections, setSections] = useState<SectionStatusResponse | null>(null);

  const [recentActivity, setRecentActivity] =
    useState<RecentActivityResponse | null>(null);

  const { load: loadTodayStats } =
    useFetch<TodayStatsResponse>("/admin/stats-today");

  const { load: loadSectionStatus } = useFetch<SectionStatusResponse>(
    "/admin/sections-status",
  );

  const { load: loadRecentActivity } = useFetch<RecentActivityResponse>(
    "/admin/activity-logs",
  );

  useEffect(() => {
    const loadData = async () => {
      const [statsRes, sectionsRes, activityRes] = await Promise.all([
        loadTodayStats(),
        loadSectionStatus(),
        loadRecentActivity(),
      ]);

      setTodayStats(statsRes);
      setSections(sectionsRes);
      setRecentActivity(activityRes);
    };

    loadData();
  }, []);

  const refreshTodayStats = async () => {
    const [statsRes, sectionsRes, activityRes] = await Promise.all([
      loadTodayStats(),
      loadSectionStatus(),
      loadRecentActivity(),
    ]);

    setTodayStats(statsRes);
    setSections(sectionsRes);
    setRecentActivity(activityRes);
  };

  useQueueUpdates(refreshTodayStats);

  const stats = todayStats?.data;
  const sectionsData = sections?.data ?? {
    indoor: 0,
    outdoor: 0,
    bar: 0,
    vip: 0,
  };
  const recentActivityData = recentActivity?.data ?? [];
  const totalGuest = (stats?.waiting ?? 0) + (stats?.called ?? 0);

  const { showToast } = useToast();

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
    </div>
  );
}
