"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="bg-white border-b border-border py-4 px-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="font-serif text-2xl text-text">
        Admin <span className="text-brand italic">Panel</span>
      </div>

      <button
        onClick={handleLogout}
        className="text-[13px] font-medium text-text-muted hover:text-text cursor-pointer"
      >
        Log out
      </button>
    </div>
  );
}
