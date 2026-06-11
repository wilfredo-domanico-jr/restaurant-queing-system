"use client";

import NowServing from "./NowServing";
import UpNext from "./UpNext";

export default function LeftPanel() {
  return (
    <div className="p-8 flex flex-col gap-6 overflow-hidden">
      <NowServing />
      <UpNext />
    </div>
  );
}
