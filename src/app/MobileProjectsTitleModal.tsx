"use client";
import { useState } from "react";
export default function MobileProjectsTitleModal() {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`fixed md:hidden top-0 left-0 w-full h-full z-50 flex items-center justify-center transition-all duration-300 ${open ? '' : 'pointer-events-none opacity-0'}`}
      style={{
        background: open
          ? 'rgba(255,255,255,0.10)'
          : 'transparent',
        backdropFilter: open ? 'blur(16px)' : undefined,
        WebkitBackdropFilter: open ? 'blur(16px)' : undefined,
      }}
    >
      {open && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <button
            className="mb-4 text-3xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            onClick={() => setOpen(false)}
            aria-label="Close"
            style={{ zIndex: 10 }}
          >
            ×
          </button>
          <h2 className="text-4xl font-extrabold capitalize tracking-tight text-[#4c1d95] dark:text-zinc-100 text-center mb-0">Past Projects</h2>
        </div>
      )}
    </div>
  );
}