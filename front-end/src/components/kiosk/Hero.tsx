"use client";

export default function Hero() {
  return (
    <>
      <div className="bg-brand px-6 pt-12 pb-16 text-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.08)_0%,transparent_60%)]">
        <div className="inline-block bg-white/15 text-white text-[11px] font-semibold tracking-[2.5px] uppercase px-3.5 py-1.5 rounded-full mb-4">
          Welcome to Saveur
        </div>

        <h1 className="font-serif text-6xl text-white leading-none">
          Join the <br />
          <em className="italic">waitlist</em>
        </h1>

        <p className="text-white/75 mt-3 text-base font-light">
          Get a ticket and we'll call you when your table is ready.
        </p>
      </div>
      <div className="bg-brand-dark flex gap-8 items-center justify-center text-wrap px-2 py-2">
        <div className="flex items-center gap-2 text-white text-xs">
          Now serving: <span className="font-semibold">—</span>
        </div>
        <div className="w-px h-2 bg-white"></div>
        <div className="flex items-center gap-2 text-white text-xs">
          Waiting: <span className="font-semibold">0</span>
        </div>
        <div className="w-px h-2 bg-white"></div>
        <div className="flex items-center gap-2 text-white text-xs">
          Est. wait: <span className="font-semibold">—</span>
        </div>
      </div>
    </>
  );
}
