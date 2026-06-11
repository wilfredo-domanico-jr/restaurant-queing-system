"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("00:00:00");

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="border-b border-white/10 py-5 px-8 flex items-center justify-between">
      <div className="font-serif text-2xl text-white">
        Saveur <em className="text-brand-mid italic">Queue</em>
      </div>

      <div className="text-lg font-light text-white/50 tabular-nums">
        {time}
      </div>
    </div>
  );
}
