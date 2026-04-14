"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const services = [
  {
    icon: "\uD83D\uDCBB",
    title: "Web Development",
    desc: "Modern, responsive websites using the latest technologies and best practices."
  },
  {
    icon: "\uD83C\uDFA8",
    title: "UI/UX Design",
    desc: "Beautiful, user-friendly interfaces and experiences tailored to your brand."
  },
  {
    icon: "\uD83E\uDDD1\u200D\uD83D\uDCBC",
    title: "Consulting",
    desc: "Expert advice and strategy to help you achieve your digital goals."
  },
  {
    icon: "\uD83D\uDD0D",
    title: "SEO",
    desc: "Search engine optimization to boost your website’s visibility and ranking on Google and other search engines."
  }
];


export default function ThreeDCarouselServices() {
  const [active, setActive] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const cardCount = services.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((prev) => (prev - 1 + cardCount) % cardCount);
      if (e.key === "ArrowRight") setActive((prev) => (prev + 1) % cardCount);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cardCount]);

  // 3D carousel transform logic (smaller size)
  const getTransform = (idx: number) => {
    const offset = ((idx - active + cardCount) % cardCount);
    const angle = 360 / cardCount;
    return `rotateY(${offset * angle}deg) translateZ(120px)`;
  };

  // Drag interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 30) {
      if (delta < 0) setActive((prev) => (prev + 1) % cardCount);
      else setActive((prev) => (prev - 1 + cardCount) % cardCount);
    }
    setDragStartX(null);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center select-none">
      <div
          className="relative w-full h-[60vh] flex items-center justify-center"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setDragStartX(null)}
      >
        {/* Carousel cards */}
        {services.map((service, idx) => (
          <motion.div
            key={service.title}
            className={`absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/40 backdrop-blur-md shadow-xl p-8 sm:p-10 transition-transform duration-700 ease-in-out cursor-pointer ${active === idx ? "z-20 scale-105 ring-2 ring-[#a78bfa88]" : "z-10"}`}
            style={{
              transform: getTransform(idx),
              transition: "transform 0.7s cubic-bezier(.77,0,.18,1), box-shadow 0.3s",
              boxShadow: active === idx ? "0 12px 32px 0 rgba(167,139,250,0.18)" : undefined,
              opacity: active === idx ? 1 : 0.7,
            }}
            onClick={() => setActive(idx)}
            tabIndex={0}
            aria-label={service.title}
          >
            <span className="text-4xl sm:text-5xl font-bold text-[#4c1d95] dark:text-[#a78bfa] text-center mb-4">{service.title}</span>
            <span className="text-7xl mb-6">{service.icon}</span>
            <p className="text-zinc-700 dark:text-zinc-200 text-center text-2xl sm:text-3xl font-normal max-w-2xl w-full">{service.desc}</p>
          </motion.div>
        ))}
      </div>
      {/* Navigation arrows and dots below the card */}
      <div className="flex flex-col items-center mt-8">
        <div className="flex gap-6 mb-4">
          <button
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/40 shadow hover:bg-[#a78bfa] hover:text-white transition text-3xl"
            onClick={() => setActive((active - 1 + cardCount) % cardCount)}
            aria-label="Previous service"
          >
            <span>&#8592;</span>
          </button>
          <button
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/40 shadow hover:bg-[#a78bfa] hover:text-white transition text-3xl"
            onClick={() => setActive((active + 1) % cardCount)}
            aria-label="Next service"
          >
            <span>&#8594;</span>
          </button>
        </div>
        <div className="flex gap-4">
          {services.map((_, idx) => (
            <button
              key={idx}
              className={`w-5 h-5 rounded-full border-2 border-[#a78bfa] ${active === idx ? "bg-[#a78bfa]" : "bg-transparent"}`}
              onClick={() => setActive(idx)}
              aria-label={`Go to ${services[idx].title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


