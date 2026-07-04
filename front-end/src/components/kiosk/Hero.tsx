"use client";
import { useState, useEffect } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import { KioskTaskResponse } from "@/src/types/kiosk.types";
export default function Hero() {
  const [stats, setStats] = useState<KioskTaskResponse | null>(null);

  const { load: loadStats } = useFetch<KioskTaskResponse>("/kiosk/stats");

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadStats();
      setStats(result);
    };

    fetchData();
  }, [loadStats]);

  return (
    <>
      {/* HERO */}
      <div className="bg-brand px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16 text-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.08)_0%,transparent_60%)]">
        {/* Badge */}
        <div className="inline-block bg-white/15 text-white text-[10px] sm:text-[11px] font-semibold tracking-[2px] sm:tracking-[2.5px] uppercase px-3 py-1.5 rounded-full mb-4 sm:mb-5">
          Welcome to Saveur
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none">
          Join the <br />
          <em className="italic">waitlist</em>
        </h1>

        {/* Subtitle */}
        <p className="text-white/75 mt-3 sm:mt-4 text-sm sm:text-base font-light max-w-md mx-auto">
          Get a ticket and we&apos;ll call you when your table is ready.
        </p>
      </div>

      {/* STATS BAR */}
      <div className="bg-brand-dark px-3 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-center">
          <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
            Now serving:{" "}
            <span className="font-semibold">
              {stats?.data.nowServing ?? " — "}
            </span>
          </div>

          <div className="hidden sm:block w-px h-3 bg-white/40"></div>

          <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
            Waiting:{" "}
            <span className="font-semibold">{stats?.data.waiting ?? 0}</span>
          </div>

          <div className="hidden sm:block w-px h-3 bg-white/40"></div>

          <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
            Est. wait:{" "}
            <span className="font-semibold">
              {stats?.data.estimatedWaitMinutes != null
                ? `${stats.data.estimatedWaitMinutes} ${
                    stats.data.estimatedWaitMinutes === 1 ? "minute" : "minutes"
                  }`
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
