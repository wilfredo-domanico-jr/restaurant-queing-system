"use client";

type PartySizeProps = {
  partySize: number;
  setPartySize: (value: number) => void;
};

export default function PartySize({ partySize, setPartySize }: PartySizeProps) {
  const partyOptions = [1, 2, 3, 4, 5, 6, "7+"];

  return (
    <>
      <div className="font-serif text-2xl text-text mb-5">
        Party <span className="text-brand italic">size</span>
      </div>

      <div className="flex gap-2.5 flex-wrap mb-10">
        {partyOptions.map((p, i) => (
          <button
            key={i}
            onClick={() => setPartySize(i === 6 ? 7 : (p as number))}
            className={`flex-1 min-w-[70px] max-w-[100px] aspect-square rounded-2xl border-3 cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-1 hover:border-brand-mid
              ${
                partySize === (i === 6 ? 7 : p)
                  ? "border-brand bg-brand-light"
                  : "bg-white border-border hover:border-brand-mid"
              }`}
          >
            <span
              className={`font-serif text-3xl leading-none ${partySize === (i === 6 ? 7 : p) ? "text-brand" : "text-text"}`}
            >
              {p}
            </span>
            <span className="text-[12px] text-text-muted uppercase font-bold">
              {i === 0
                ? "solo"
                : i === 1
                  ? "pair"
                  : i === 5
                    ? "large"
                    : i === 6
                      ? "event"
                      : "group"}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
