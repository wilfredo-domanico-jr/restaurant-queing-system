"use client";

type HeaderProps = {
  simulateJoin: () => void;
  callNext: () => void;
};
export default function Header({ simulateJoin, callNext }: HeaderProps) {
  return (
    <div className="bg-white border-b border-border py-4 px-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="font-serif text-2xl text-text">
        Admin <span className="text-brand italic">Panel</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={simulateJoin}
          className="bg-white text-text border border-border px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#F5EDE8] hover:border-brand-mid hover:text-brand cursor-pointer"
        >
          + Simulate Guest
        </button>

        <button
          onClick={callNext}
          className="bg-brand text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-dark  cursor-pointer"
        >
          📣 Call Next
        </button>
      </div>
    </div>
  );
}
