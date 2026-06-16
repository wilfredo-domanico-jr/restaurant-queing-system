// src/context/ToastContext.tsx
"use client";

import { createContext, useContext, useRef, useState, ReactNode } from "react";

type Toast = {
  message: string;
  visible: boolean;
};

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, visible: true });

    timerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));

      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 300);
    }, 2800);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* GLOBAL TOAST UI */}
      <div
        className={`fixed bottom-6 right-6 bg-text text-white px-5 py-3 rounded-xl text-xs font-medium z-[200] max-w-[300px] transition-all duration-300
        ${
          toast?.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {toast?.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
