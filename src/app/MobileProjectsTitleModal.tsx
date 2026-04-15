"use client";
import { useState } from "react";

import GlitchTitle from "../components/GlitchTitle";

export default function MobileProjectsTitleModal() {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`fixed md:hidden top-0 left-0 w-full h-full z-50 flex items-center justify-center transition-all duration-300 ${open ? '' : 'pointer-events-none opacity-0'}`}
      style={{
        background: open ? 'rgba(0,0,0,0.92)' : 'transparent',
        backdropFilter: undefined,
        WebkitBackdropFilter: undefined,
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
          <GlitchTitle
            as="h2"
            glitchClassName="glitch-chromatic"
            className="text-4xl font-extrabold capitalize tracking-tight text-zinc-900 dark:text-zinc-100 text-center mb-0"
          >
            Past Projects
          </GlitchTitle>
        </div>
      )}
    </div>
  );
}