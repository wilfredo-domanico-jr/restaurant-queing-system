export default function Sidebar() {
  return (
    <div className="col-span-1 pl-0 md:pl-5 pt-4 md:pt-0 flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
          Sections
        </div>
        <div className="text-sm text-text-muted">No data yet</div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
          Recent Activity
        </div>

        <div className="py-2 border-b border-[#F5EDE8] flex gap-2 items-start">
          <div className="w-1.5 h-1.5 rounded-full mt-1 bg-brand"></div>
          <div>
            <div className="text-xs text-text">System started</div>
            <div className="text-[11px] text-text-muted">just now</div>
          </div>
        </div>
      </div>
    </div>
  );
}
