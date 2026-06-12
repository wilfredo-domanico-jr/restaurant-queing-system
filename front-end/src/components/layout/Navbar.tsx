"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const baseClass =
    "px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap";

  const activeClass = "bg-brand-light text-brand";
  const inactiveClass = "text-text-muted hover:bg-[#F5EDE8] hover:text-brand";

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center px-4 sm:px-6 h-12">
        {/* Logo */}
        <a
          className="mr-auto flex items-center gap-2.5 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 stroke-white stroke-2"
              fill="none"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 12h18M3 6l9 2 9-2M3 18l9-2 9 2" />
            </svg>
          </div>

          {/* Hide text on small screens */}
          <div className="hidden sm:block">
            <div className="font-serif text-lg text-text tracking-tight leading-none">
              QUÉ
            </div>
            <div className="text-[10px] text-text-muted font-medium tracking-[2px] uppercase -mt-0.5">
              Queue System
            </div>
          </div>
        </a>

        {/* Tabs (responsive scroll on mobile) */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => router.push("/")}
            className={`${baseClass} ${
              isActive("/") ? activeClass : inactiveClass
            }`}
          >
            🎟 Kiosk
          </button>

          <button
            onClick={() => router.push("/display")}
            className={`${baseClass} ${
              isActive("/display") ? activeClass : inactiveClass
            }`}
          >
            📺 Display
          </button>

          <button
            onClick={() => router.push("/admin")}
            className={`${baseClass} ${
              isActive("/admin") ? activeClass : inactiveClass
            }`}
          >
            ⚙️ Admin
          </button>
        </div>
      </div>
    </nav>
  );
}
