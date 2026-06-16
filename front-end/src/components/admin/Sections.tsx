"use client";

import type { SectionStatusItem } from "@/src/types/admin.types";

type SectionProps = {
  sectionsData: SectionStatusItem;
};

export default function Sections({ sectionsData }: SectionProps) {
  const hasData = !!sectionsData;

  console.log("eto yung sections", sectionsData);

  const getSectionColor = (section: string) => {
    switch (section) {
      case "indoor":
        return "bg-[#C8410B]";

      case "outdoor":
        return "bg-[#15803D]";

      case "bar":
        return "bg-[#1D4ED8]";

      case "vip":
        return "bg-[#7C3AED]";

      default:
        return "bg-brand";
    }
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case "vip":
        return "VIP";
      case "bar":
        return "Bar";
      case "indoor":
        return "Indoor";
      case "outdoor":
        return "Outdoor";
      default:
        return section.charAt(0).toUpperCase() + section.slice(1);
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="text-[13px] font-bold text-text-muted uppercase tracking-wider mb-4">
        Sections
      </div>

      {hasData ? (
        <div className="flex flex-col gap-2">
          {Object.entries(sectionsData ?? {}).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center px-2.5 py-2 bg-[#FDFAF8] rounded-lg border border-border"
            >
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-text">
                <span
                  className={`w-2 h-2 rounded-full ${getSectionColor(key)}`}
                />
                {getSectionLabel(key)}
              </span>

              <span className="text-[13px] font-bold text-brand">{value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-text-muted">No data yet</div>
      )}
    </div>
  );
}
