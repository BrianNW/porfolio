"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const projects = [
  { name: 'Alivio', file: 'alivio.PNG' },
  { name: 'Element1', file: 'element1.PNG' },
  { name: 'House Appeal Pro', file: 'houseappealpro.PNG' },
  { name: 'Karuna Health', file: 'karuna health.PNG' },
  { name: 'Madhouse Wargaming', file: 'madhousewargaming.JPG' },
  { name: 'Paws at Play', file: 'pawsatplay.PNG' },
  { name: 'Plaza Canna', file: 'Plaza Canna.JPG' },
  { name: 'Shopiir2', file: 'Shopiir2.JPG' },
  { name: 'Xpressbud', file: 'xpressbud.PNG' },
];

export default function VerticalCarouselProjects() {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const itemHeight = 400;
  const gap = 0;
  const totalProjects = projects.length;
  const totalHeight = (itemHeight + gap) * totalProjects;
  const displayProjects = [...projects, ...projects];

  // Infinite auto-scroll unless manual mode, resume after 3s inactivity
  useEffect(() => {
    if (manual) return;
    let animationFrame: number;
    let y = scrollY;
    const speed = 0.5; // px per frame
    function animate() {
      y -= speed;
      if (Math.abs(y) >= totalHeight) y = 0;
      controls.set({ y });
      setScrollY(y);
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line
  }, [manual, controls, totalHeight]);

  // Resume auto-scroll after 3s of inactivity
  function triggerManualMode() {
    setManual(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => setManual(false), 3000);
  }

  // Touch/click to enable manual scroll
  function handlePointerDown(e: React.PointerEvent) {
    triggerManualMode();
    setStartY(e.clientY || (e as any).touches?.[0]?.clientY || 0);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (manual && startY !== null) {
      triggerManualMode();
      const clientY = e.clientY || (e as any).touches?.[0]?.clientY || 0;
      const delta = clientY - startY;
      let newY = scrollY + delta;
      if (Math.abs(newY) >= totalHeight) newY = 0;
      if (newY > 0) newY = -totalHeight;
      controls.set({ y: newY });
    }
  }
  function handlePointerUp(e: React.PointerEvent) {
    triggerManualMode();
    setStartY(null);
    setScrollY(prev => {
      const clientY = e.clientY || (e as any).changedTouches?.[0]?.clientY || 0;
      const delta = clientY - (startY ?? 0);
      let newY = prev + delta;
      if (Math.abs(newY) >= totalHeight) newY = 0;
      if (newY > 0) newY = -totalHeight;
      return newY;
    });
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={manual ? handlePointerMove : undefined}
      onPointerUp={manual ? handlePointerUp : undefined}
      onPointerLeave={manual ? handlePointerUp : undefined}
      onTouchStart={handlePointerDown}
      onTouchMove={manual ? handlePointerMove : undefined}
      onTouchEnd={manual ? handlePointerUp : undefined}
      style={{ touchAction: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={controls}
        style={{ minHeight: totalHeight * 2, pointerEvents: 'auto', width: '100%' }}
      >
        {displayProjects.map((project, idx) => (
          <div
            key={idx + project.name}
            className="w-full"
            style={{ height: itemHeight, minHeight: itemHeight }}
          >
            <img
              src={`/projects/${project.file}`}
              alt={project.name}
              className="object-contain w-full h-full"
              draggable={false}
              style={{ borderRadius: 0, margin: 0, padding: 0 }}
            />
          </div>
        ))}
      </motion.div>
      {/* No visible scrollbar */}
      <style>{`.vertical-carousel::-webkit-scrollbar { display: none !important; }`}</style>
    </div>
  );
}
