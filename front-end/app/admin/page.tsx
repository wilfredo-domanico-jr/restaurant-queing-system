"use client";

import CurrentQueue from "@/src/components/admin/CurrentQueue";
import Header from "@/src/components/admin/Header";
import Sidebar from "@/src/components/admin/Sidebar";
import StatsCard from "@/src/components/admin/StatCard";

export default function Admin() {
  function simulateJoin() {
    console.log("Simulate guest clicked");
  }

  function callNext() {
    console.log("Call next clicked");
  }

  const stats = [
    { label: "Waiting", value: "0", sub: "in queue", highlight: true },
    { label: "Called", value: "0", sub: "being seated" },
    { label: "Seated", value: "0", sub: "today" },
    { label: "No-shows", value: "0", sub: "today" },
    { label: "Avg. Wait", value: "—", sub: "minutes" },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F9F5F1]">
      {/* HEADER */}
      <Header simulateJoin={simulateJoin} callNext={callNext} />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 sm:p-6">
        {stats.map((item, index) => (
          <StatsCard
            key={index}
            label={item.label}
            value={item.value}
            sub={item.sub}
            highlight={item.highlight}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 px-4 sm:px-6 pb-6">
        <CurrentQueue />
        <Sidebar />
      </div>
    </div>
  );
}
