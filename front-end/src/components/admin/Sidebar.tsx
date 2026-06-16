import RecentActivity from "./RecentActivity";

import type {
  RecentActivityItem,
  SectionStatusItem,
} from "@/src/types/admin.types";

import Sections from "./Sections";

type SidebarProps = {
  recentActivity: RecentActivityItem[];
  sectionsData: SectionStatusItem;
};

export default function Sidebar({
  recentActivity,
  sectionsData,
}: SidebarProps) {
  return (
    <div className="col-span-1 pl-0 md:pl-5 pt-4 md:pt-0 flex flex-col gap-4">
      <Sections sectionsData={sectionsData} />
      <RecentActivity recentActivity={recentActivity} />
    </div>
  );
}
