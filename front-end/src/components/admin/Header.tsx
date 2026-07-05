"use client";

import { useRouter } from "next/navigation";
import { usePost } from "@/src/hooks/usePost";

export default function Header() {
  const router = useRouter();
  const { post: logout } = usePost<{ message: string }>("/auth/logout");

  const handleLogout = async () => {
    await logout();
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
