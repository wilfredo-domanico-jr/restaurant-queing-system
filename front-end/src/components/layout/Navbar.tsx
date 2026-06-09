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
      <div className="max-w-5xl mx-auto flex items-center px-6 h-11">
        {/* Logo */}
        <a
          className="mr-auto flex items-center gap-2.5 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 fill-none stroke-white stroke-2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 12h18M3 6l9 2 9-2M3 18l9-2 9 2" />
            </svg>
          </div>

          <div>
            <div className="font-serif text-lg text-text tracking-tight">
              QUÉ
            </div>
            <div className="text-[10px] text-text-muted font-medium tracking-[2px] uppercase -mt-1">
              Queue System
            </div>
          </div>
        </a>

        {/* Tabs */}
        <div className="flex gap-1">
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

        {/* Status */}
        <div className="hidden sm:flex items-center gap-1.5 ml-4 text-xs font-medium text-[#3D8B3D]">
          <span className="w-1.5 h-1.5 bg-[#3D8B3D] rounded-full animate-pulse"></span>
          <span>0 waiting</span>
        </div>
      </div>
    </nav>
  );
}
