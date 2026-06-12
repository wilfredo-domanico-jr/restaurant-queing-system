"use client";

import Header from "@/src/components/display/Header";
import LeftPanel from "@/src/components/display/LeftPanel";
import RightPanel from "@/src/components/display/RightPanel";

export default function Display() {
  return (
    <div className="h-auto bg-[#1A1108]">
      <Header />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}
