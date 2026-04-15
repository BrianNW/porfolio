"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { withBasePath } from "@/lib/base-path";

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
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const startYRef = useRef<number | null>(null);
  const gestureStartScrollYRef = useRef(0);
  const scrollYRef = useRef(0);
  const itemHeight = 400;
  const gap = 0;
  const totalProjects = projects.length;
  const totalHeight = (itemHeight + gap) * totalProjects;
  const displayProjects = [...projects, ...projects];

  function normalizeY(value: number) {
    let nextValue = value;

    while (nextValue <= -totalHeight) {
      nextValue += totalHeight;
    }

    while (nextValue > 0) {
      nextValue -= totalHeight;
    }

    return nextValue;
  }

  function setCarouselY(value: number) {
    const normalizedValue = normalizeY(value);
    scrollYRef.current = normalizedValue;
    controls.set({ y: normalizedValue });
    return normalizedValue;
  }

  // Infinite auto-scroll unless manual mode, resume after 3s inactivity
  useEffect(() => {
    if (manual) return;
    let animationFrame: number;
    const speed = 0.5; // px per frame

    function animate() {
      setCarouselY(scrollYRef.current - speed);
      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [manual, controls, totalHeight]);

  useEffect(() => {
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  // Resume auto-scroll after 3s of inactivity
  function triggerManualMode() {
    setManual(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => setManual(false), 3000);
  }

  function getTouchClientY(event: React.TouchEvent<HTMLDivElement>) {
    return event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY ?? 0;
  }

  // Touch/click to enable manual scroll
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    triggerManualMode();
    startYRef.current = e.clientY;
    gestureStartScrollYRef.current = scrollYRef.current;
  }
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (manual && startYRef.current !== null) {
      triggerManualMode();
      const clientY = e.clientY;
      const delta = clientY - startYRef.current;
      setCarouselY(gestureStartScrollYRef.current + delta);
    }
  }
  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    triggerManualMode();
    if (startYRef.current !== null) {
      const clientY = e.clientY;
      const delta = clientY - startYRef.current;
      setCarouselY(gestureStartScrollYRef.current + delta);
    }
    startYRef.current = null;
  }
  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    triggerManualMode();
    startYRef.current = getTouchClientY(e);
    gestureStartScrollYRef.current = scrollYRef.current;
  }
  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (manual && startYRef.current !== null) {
      triggerManualMode();
      const clientY = getTouchClientY(e);
      const delta = clientY - startYRef.current;
      setCarouselY(gestureStartScrollYRef.current + delta);
    }
  }
  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    triggerManualMode();
    if (startYRef.current !== null) {
      const clientY = getTouchClientY(e);
      const delta = clientY - startYRef.current;
      setCarouselY(gestureStartScrollYRef.current + delta);
    }
    startYRef.current = null;
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={manual ? handlePointerMove : undefined}
      onPointerUp={manual ? handlePointerUp : undefined}
      onPointerLeave={manual ? handlePointerUp : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={manual ? handleTouchMove : undefined}
      onTouchEnd={manual ? handleTouchEnd : undefined}
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
            style={{ height: itemHeight, minHeight: itemHeight, margin: 0, padding: 0 }}
          >
            <img
              src={withBasePath(`/projects/${project.file}`)}
              alt={project.name}
              className="object-cover w-full h-full block"
              draggable={false}
              style={{ borderRadius: 0, margin: 0, padding: 0, boxShadow: 'none', background: 'none' }}
            />
          </div>
        ))}
      </motion.div>
      {/* No visible scrollbar */}
      <style>{`.vertical-carousel::-webkit-scrollbar { display: none !important; }`}</style>
    </div>
  );
}
