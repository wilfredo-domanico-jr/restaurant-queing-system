"use client";

type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
};
export default function StatsCard({
  label,
  value,
  sub,
  highlight = false,
}: StatCardProps) {
  
  return (
    <div className="bg-white border border-border rounded-xl p-4 px-5">
      <div className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1.5">
        {label}
      </div>

      <div
        className={`font-serif text-3xl leading-none ${
          highlight ? "text-brand" : "text-text"
        }`}
      >
        {value}
      </div>

      <div className="text-xs text-text-muted mt-1">{sub}</div>
    </div>
  );
}
