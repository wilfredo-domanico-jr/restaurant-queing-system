"use client";

export default function Header() {
  return (
    <div className="bg-white border-b border-border py-4 px-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="font-serif text-2xl text-text">
        Admin <span className="text-brand italic">Panel</span>
      </div>
    </div>
  );
}
