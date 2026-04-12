"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const initialServices = [
  {
    icon: "💻",
    title: "Web Development",
    desc: "Modern, responsive websites using the latest technologies and best practices."
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Beautiful, user-friendly interfaces and experiences tailored to your brand."
  },
  {
    icon: "🧑‍💼",
    title: "Consulting",
    desc: "Expert advice and strategy to help you achieve your digital goals."
  },
  {
    icon: "🔍",
    title: "SEO",
    desc: "Search engine optimization to boost your website’s visibility and ranking on Google and other search engines."
  }
];

export default function VerticalCarouselServices() {
  // Assign grid areas for a mosaic pattern (expandable for more services)
  const services = initialServices;
  // Example for 4 services, expanded mosaic
  const gridAreas = [
    'a a b',
    'd c c',
  ];
  const areaNames = ['a', 'b', 'c', 'd'];
  // Map each service to a grid area
  const serviceAreas = services.map((service, i) => areaNames[i] || `area${i}`);

  return (
    <div
      className="w-full h-[calc(100vh-8rem)] min-h-[500px] grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gridTemplateAreas: `"${gridAreas[0]}" "${gridAreas[1]}"`,
        gap: 0,
        width: '100vw',
        height: 'calc(100vh - 8rem)',
        minHeight: 500,
        maxWidth: '100vw',
      }}
    >
      {services.map((service, i) => (
        <div
          key={service.title}
          style={{ gridArea: serviceAreas[i] }}
          className="flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/40 backdrop-blur-md shadow-xl p-6 sm:p-8 transition hover:scale-105 hover:shadow-2xl cursor-pointer min-h-[120px] min-w-0 h-full w-full"
        >
          <div className="flex flex-col items-center justify-center w-full">
            <span className="text-3xl sm:text-4xl font-bold text-[#4c1d95] dark:text-[#a78bfa] text-center mb-2">{service.title}</span>
            <span className="text-3xl mb-4">{service.icon}</span>
            <p className="text-zinc-700 dark:text-zinc-200 text-center text-base sm:text-lg font-normal max-w-xs w-full">{service.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
// Responsive grid for mobile
// Add at the end of the file (or in global CSS if preferred)
//
// @media (max-width: 640px) {
//   .services-mosaic {
//     grid-template-columns: 1fr;
//     grid-template-rows: repeat(3, 1fr);
//     grid-template-areas:
//       "a"
//       "b"
//       "c";
//   }
// }
