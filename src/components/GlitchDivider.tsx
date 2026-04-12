import React from "react";

// A glitchy cyberpunk divider for section transitions
export default function GlitchDivider() {
  return (
    <div className="relative w-full flex items-center justify-center my-0">
      <div className="glitch-divider h-8 w-full max-w-3xl flex items-center justify-center">
        <span className="block w-full h-1 bg-gradient-to-r from-[#a78bfa] via-[#4c1d95] to-[#a78bfa] glitch-divider-bar" />
        {/* RGB split overlays for cyberpunk effect */}
        <span className="glitch-divider-bar glitch-divider-bar-r absolute left-0 top-1" />
        <span className="glitch-divider-bar glitch-divider-bar-g absolute left-0 top-2" />
        <span className="glitch-divider-bar glitch-divider-bar-b absolute left-0 top-3" />
      </div>
    </div>
  );
}
