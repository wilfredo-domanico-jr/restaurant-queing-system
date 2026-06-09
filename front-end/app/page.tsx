"use client";

import { useState } from "react";

export default function Kiosk() {
  const [partySize, setPartySize] = useState<number | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [name, setName] = useState("");

  const partyOptions = [1, 2, 3, 4, 5, 6, "7+"];

  const sections = [
    { name: "Indoor", icon: "🪑", desc: "Air-conditioned" },
    { name: "Outdoor", icon: "☀️", desc: "Garden patio" },
    { name: "Bar", icon: "🍸", desc: "Counter seating" },
    { name: "VIP", icon: "✨", desc: "Private area" },
  ];

  function joinQueue() {
    console.log({
      name,
      partySize,
      section,
    });
  }

  return (
    <div className="view active block min-h-[calc(100vh-56px)] bg-cream">
      {/* HERO */}
      <div className="bg-brand px-6 pt-12 pb-16 text-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.08)_0%,transparent_60%)]">
        <div className="inline-block bg-white/15 text-white text-[11px] font-semibold tracking-[2.5px] uppercase px-3.5 py-1.5 rounded-full mb-4">
          Welcome to Saveur
        </div>

        <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white leading-none">
          Join the <em className="italic">waitlist</em>
        </h1>

        <p className="text-white/75 mt-3 text-base font-light">
          Get a ticket and we'll call you when your table is ready.
        </p>
      </div>

      {/* PARTY SIZE */}
      <div className="max-w-[900px] mx-auto py-10 px-6">
        <div className="font-serif text-2xl text-text mb-5">
          Party <span className="text-brand italic">size</span>
        </div>

        <div className="flex gap-2.5 flex-wrap mb-10">
          {partyOptions.map((p, i) => (
            <button
              key={i}
              onClick={() => setPartySize(i === 6 ? 7 : (p as number))}
              className={`flex-1 min-w-[70px] max-w-[100px] aspect-square rounded-2xl border-2 bg-white flex flex-col items-center justify-center transition-all
              ${
                partySize === (i === 6 ? 7 : p)
                  ? "border-brand bg-brand-light"
                  : "border-border hover:border-brand-mid"
              }`}
            >
              <span className="font-serif text-3xl">{p}</span>
              <span className="text-[10px] text-text-muted uppercase">
                {i === 0
                  ? "solo"
                  : i === 1
                    ? "pair"
                    : i === 6
                      ? "event"
                      : "group"}
              </span>
            </button>
          ))}
        </div>

        {/* SECTIONS */}
        <div className="font-serif text-2xl text-text mb-5">
          Seating <span>preference</span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-10">
          {sections.map((s) => (
            <div
              key={s.name}
              onClick={() => setSection(s.name)}
              className={`bg-white border-2 rounded-2xl p-5 text-center cursor-pointer transition-all
              ${
                section === s.name
                  ? "border-brand bg-brand-light"
                  : "border-border hover:border-brand-mid"
              }`}
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-semibold text-sm">{s.name}</div>
              <div className="text-[11px] text-text-muted">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* NAME + BUTTON */}
        <div className="font-serif text-2xl text-text mb-5">
          Your <span className="text-brand italic">name</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end mb-10">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-border rounded-xl p-3"
            placeholder="e.g. Maria Santos"
          />

          <button
            onClick={joinQueue}
            disabled={!name || !partySize || !section}
            className="bg-brand text-white rounded-xl py-3 px-7 disabled:opacity-40"
          >
            Get Ticket →
          </button>
        </div>
      </div>
    </div>
  );
}
