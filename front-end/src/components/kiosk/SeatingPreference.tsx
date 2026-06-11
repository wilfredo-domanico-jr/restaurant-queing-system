"use client";

type SeatingPreferenceProps = {
  section: string | null;
  setSection: React.Dispatch<React.SetStateAction<string | null>>;
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
    </>
  );
}
