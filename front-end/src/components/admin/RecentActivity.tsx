"use client";

import type { RecentActivityItem } from "@/src/types/admin.types";

type RecentActivityProps = {
  recentActivity: RecentActivityItem[];
};

export default function RecentActivity({
  recentActivity,
}: RecentActivityProps) {
  const activities = recentActivity ?? [];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Removed":
        return "bg-[#888]";

      case "Called":
        return "bg-[#15803D]";

      case "No-Show":
        return "bg-[#991B1B]";

      case "Seated":
        return "bg-[#1D4ED8]";

      default:
        return "bg-brand";
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="text-[13px] font-bold text-text-muted uppercase tracking-wider mb-4">
        Recent Activity
      </div>

      {activities.length === 0 ? (
        <div className="text-sm text-text-muted">No activities yet</div>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="py-2 border-b border-[#F5EDE8] flex gap-2 items-start"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1 ${getTypeColor(activity.type)}`}
            ></div>
            <div>
              <div className="text-[13px] text-text">
                {activity.description}
              </div>
              <div className="text-[11px] text-text-muted">
                {new Date(activity.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        ))
      )}

      {activities?.length < 5 && (
        <div className="py-2 border-b border-[#F5EDE8] flex gap-2 items-start">
          <div className="w-1.5 h-1.5 rounded-full mt-1 bg-brand"></div>
          <div>
            <div className="text-[13px] text-text">System started</div>
            <div className="text-[11px] text-text-muted">just now</div>
          </div>
        </div>
      )}
    </div>
  );
}
