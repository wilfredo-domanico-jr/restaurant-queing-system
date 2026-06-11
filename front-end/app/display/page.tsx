"use client";

import Header from "@/src/components/display/Header";
import LeftPanel from "@/src/components/display/LeftPanel";
import RightPanel from "@/src/components/display/RightPanel";

export default function Display() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#1A1108]">
      <Header />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] h-[calc(100vh-56px-69px)]">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}
