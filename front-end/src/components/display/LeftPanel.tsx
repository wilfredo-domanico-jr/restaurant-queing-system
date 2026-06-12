"use client";

import NowServing from "./NowServing";
import UpNext from "./UpNext";

export default function LeftPanel() {
  return (
    <div className="col-span-4 p-8 flex flex-col gap-6">
      <NowServing />
      <UpNext />
    </div>
  );
}
