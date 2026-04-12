import React, { useState, useEffect, useRef } from "react";


interface GlitchTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  glitchClassName?: string;
  fixedInterval?: number;
}

export default function GlitchTitle({ children, className = "", as = "span", glitchClassName = "glitch-chromatic", fixedInterval }: GlitchTitleProps) {
  const [glitch, setGlitch] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Always use a fixed interval for reliable glitching
  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => { if (mounted) setGlitch(false); }, 400);
    }, fixedInterval ?? 3500);
    intervalRef.current = interval;
    return () => { mounted = false; clearInterval(interval); };
  }, [fixedInterval]);

  const Tag = as;
  // Always apply glitch-chromatic, add .glitch only when glitching
  const glitchClass = `${glitchClassName}${glitch ? " glitch" : ""}`;
  return (
    <Tag className={`${glitchClass} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
