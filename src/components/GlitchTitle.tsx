import React, { useState, useEffect, useRef } from "react";


interface GlitchTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  glitchClassName?: string;
  fixedInterval?: number;
}

import { useContext } from "react";
import { ThemeContext } from "./ClientLayout";

export default function GlitchTitle({ children, className = "", as = "span", glitchClassName = "glitch-chromatic", fixedInterval }: GlitchTitleProps) {
  const [glitch, setGlitch] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isDark } = useContext(ThemeContext) || { isDark: false };

  // Only enable glitch in dark mode, or if forced by a prop
  const forceGlitch = className?.includes("force-glitch");

  useEffect(() => {
    let mounted = true;
    if (isDark || forceGlitch) {
      const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => { if (mounted) setGlitch(false); }, 400);
      }, fixedInterval ?? 3500);
      intervalRef.current = interval;
      return () => { mounted = false; clearInterval(interval); };
    } else {
      setGlitch(false);
    }
    return () => {};
  }, [fixedInterval, isDark, forceGlitch]);

  const Tag = as;
  // Always apply glitch-chromatic for color, only animate glitch in dark mode or if forced
  const glitchClass = `${glitchClassName} ${(isDark || forceGlitch) && glitch ? "glitch" : ""}`;
  // Responsive: increase section title font size on mobile
  const responsiveClass =
    "text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold";
  const isSectionTitle = className?.includes("section-title") || className?.includes("text-center") || className?.includes("font-extrabold");
  return (
    <Tag
      className={
        `${glitchClass} ${isSectionTitle ? responsiveClass : ""} ${className}`.trim()
      }
    >
      {children}
    </Tag>
  );
}
