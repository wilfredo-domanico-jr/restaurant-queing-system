"use client";

export default function Admin() {
  function simulateJoin() {
    console.log("Simulate guest clicked");
  }

  function callNext() {
    console.log("Call next clicked");
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F9F5F1]">
      {/* HEADER */}
      <div className="bg-white border-b border-border py-4 px-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="font-serif text-2xl text-text">
          Admin <span className="text-brand italic">Panel</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={simulateJoin}
            className="bg-white text-text border border-border px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#F5EDE8] hover:border-brand-mid hover:text-brand"
          >
            + Simulate Guest
          </button>

          <button
            onClick={callNext}
            className="bg-brand text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-dark"
          >
            📣 Call Next
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 p-4 sm:p-6">
        <Stat label="Waiting" value="0" sub="in queue" highlight />
        <Stat label="Called" value="0" sub="being seated" />
        <Stat label="Seated" value="0" sub="today" />
        <Stat label="No-shows" value="0" sub="today" />
        <Stat label="Avg. Wait" value="—" sub="minutes" />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-0 px-4 sm:px-6 pb-6">
        {/* TABLE */}
        <div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {/* TABLE HEADER */}
            <div className="p-4 px-5 border-b border-border flex items-center justify-between">
              <div className="font-semibold text-sm text-text">
                Current Queue
              </div>
              <div className="bg-brand-light text-brand text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                0 guests
              </div>
            </div>

            {/* EMPTY STATE */}
            <div className="p-12 text-center text-text-muted text-sm">
              <div className="text-4xl mb-2">🎉</div>
              No guests currently in queue
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="pl-0 md:pl-5 pt-4 md:pt-0 flex flex-col gap-4">
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
      </div>
    </div>
  );
}

/* Small reusable component */
function Stat({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
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
