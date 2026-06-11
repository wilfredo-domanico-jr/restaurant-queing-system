"use client";

export default function UpNext() {
  return (
    <>
      <div className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40 mt-2">
        Up Next
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 flex-1 overflow-hidden"></div>
    </>
  );
}
