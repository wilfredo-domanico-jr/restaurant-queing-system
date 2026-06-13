import RecentActivity from "./RecentActivity";

export default function Sidebar() {
  return (
    <div className="col-span-1 pl-0 md:pl-5 pt-4 md:pt-0 flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="text-[13px] font-bold text-text-muted uppercase tracking-wider mb-4">
          Sections
        </div>
        <div className="text-[13px] text-text-muted">No data yet</div>
      </div>

      <RecentActivity />
    </div>
  );
}
