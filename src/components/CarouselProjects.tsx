"use client";
import { useRef, useEffect } from "react";
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

export default function CarouselProjects() {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  // Carousel width for infinite scroll
  const totalProjects = projects.length;
  const visibleCount = 4; // Number of projects visible at once (responsive)
  const itemWidth = 320; // px
  const gap = 32; // px
  const totalWidth = (itemWidth + gap) * totalProjects;

  useEffect(() => {
    let animationFrame: number;
    let x = 0;
    const speed = 0.3; // px per frame, adjust for slower/faster
    function animate() {
      x -= speed;
      if (Math.abs(x) >= totalWidth) x = 0;
      controls.set({ x });
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [controls, totalWidth]);

  // Duplicate projects for seamless infinite scroll
  const displayProjects = [...projects, ...projects];

  return (
    <div className="relative w-full overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex items-center"
        animate={controls}
        style={{ minWidth: totalWidth * 2 }}
      >
        {displayProjects.map((project, idx) => (
          <div
            key={idx + project.name}
            className="flex flex-col items-center justify-center mx-4 bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-700/40 backdrop-blur-md"
            style={{ width: itemWidth, minWidth: itemWidth, height: 260 }}
          >
            <div className="w-full h-44 rounded-t-2xl overflow-hidden flex items-center justify-center">
              <img
                src={withBasePath(`/projects/${project.file}`)}
                alt={project.name}
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>
            <div className="w-full flex-1 flex items-center justify-center">
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 text-center px-2">{project.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}