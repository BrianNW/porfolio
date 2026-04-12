import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Sparkle from "./Sparkle";
import GlitchDivider from "./GlitchDivider";

interface ArrowProgressProps {
  current: number;
  total: number;
}

// Simple right arrow SVG
const ArrowSVG = () => (
  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,16 40,16 32,8 32,13 8,13 8,19 32,19 32,24 40,16" fill="#a78bfa" stroke="#a78bfa" strokeWidth="2" />
  </svg>
);


const ArrowProgress: React.FC<ArrowProgressProps> = ({ current, total }) => {
  // Calculate progress as a percentage (0 to 1)
  const progress = total <= 1 ? 0 : current / (total - 1);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; key: number }[]>([]);
  const [scale, setScale] = useState(1);
  const prevCurrent = useRef(current);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevCurrent.current !== current) {
      setScale(1.18);
      const timeout = setTimeout(() => setScale(1), 250);
      prevCurrent.current = current;
      return () => clearTimeout(timeout);
    }
  }, [current]);

  return (
    <div ref={containerRef} className="fixed left-0 bottom-0 w-full h-16 z-50 pointer-events-none">
      <div className="relative w-full h-full">
        {/* Sparkle effects */}
        {sparkles.map((s) => (
          <Sparkle x={s.x} y={s.y} key={s.key} />
        ))}
        {/* Glitchy animated progress bar foreground */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full transition-all duration-700 z-10 glitch-divider-bar"
          style={{ width: `${progress * 100}%`, scale }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        />
        {/* RGB split overlays for cyberpunk effect */}
        <motion.span
          className="glitch-divider-bar glitch-divider-bar-r absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full z-10"
          style={{ width: `${progress * 100}%`, scale }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        />
        <motion.span
          className="glitch-divider-bar glitch-divider-bar-g absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full z-10"
          style={{ width: `${progress * 100}%`, scale }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        />
        <motion.span
          className="glitch-divider-bar glitch-divider-bar-b absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full z-10"
          style={{ width: `${progress * 100}%`, scale }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        />
      </div>
    </div>
  );
};

export default ArrowProgress;
