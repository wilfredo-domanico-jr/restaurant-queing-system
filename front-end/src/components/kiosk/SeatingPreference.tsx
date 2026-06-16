"use client";

type SeatingPreferenceProps = {
  section: string;
  setSection: (value: string) => void;
};

export default function SeatingPreference({
  section,
  setSection,
}: SeatingPreferenceProps) {
  const sections = [
    { name: "Indoor", icon: "🪑", desc: "Air-conditioned" },
    { name: "Outdoor", icon: "☀️", desc: "Garden patio" },
    { name: "Bar", icon: "🍸", desc: "Counter seating" },
    { name: "VIP", icon: "✨", desc: "Private area" },
  ];

  return (
    <>
      <div className="font-serif text-2xl text-text mb-5">
        Seating <span className="text-brand italic">preference</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mb-10">
        {sections.map((s) => (
          <div
            key={s.name}
            onClick={() => setSection(s.name)}
            className={`border-3 rounded-2xl p-5 text-center cursor-pointer transition-all
              ${
                section === s.name
                  ? "border-brand bg-brand-light"
                  : "bg-white border-border hover:border-brand-mid"
              }`}
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div
              className={`font-semibold text-sm ${section === s.name ? "text-brand" : "text-text"}`}
            >
              {s.name}
            </div>
            <div className="text-[12px] text-text-muted font-bold">
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
