"use client";
import { useRef, useState, useMemo, useContext, useEffect } from "react";
import { ThemeContext } from "./ClientLayout";
import GlitchTitle from "./GlitchTitle";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/base-path";

const services = [
  {
    icon: "\uD83C\uDFA8",
    title: "UI/UX\nDesign",
    desc: `Why settle for pretty when you can have pretty *and* smart? I design interfaces that delight users and guide them effortlessly to your goals. 

Expect intuitive layouts, on-brand visuals, and a user experience so smooth your customers will wonder if you’ve read their minds.`
  },
  {
    icon: "\uD83D\uDCBB",
    title: "Web Development",
    desc: `Your website is your digital handshake—let’s make it firm, memorable, and impossible to ignore. I craft blazing-fast, pixel-perfect sites that not only look stunning but convert visitors into loyal fans. 

From launch to scale, you’ll enjoy seamless performance, bulletproof security, and a site that works as hard as you do.`
  },
  {
    icon: "\uD83E\uDDD1\u200D\uD83D\uDCBC",
    title: "Consulting",
    desc: `Stuck in a digital maze? I’ll be your compass. Get actionable strategies, honest feedback, and a roadmap tailored to your ambitions—no jargon, just results. 

Together, we’ll turn your tech headaches into high-fives and your ideas into impact.`
  },
  {
    icon: "\uD83D\uDD0D",
    title: "SEO",
    desc: `Why hide on page two? I’ll help you climb the search ranks with proven SEO tactics that get you seen by the right people—at the right time. 

Enjoy more clicks, more leads, and the kind of online presence that makes your competitors jealous.`
  },
  {
    icon: "\uD83D\uDD16",
    title: "White Label",
    desc: `Want all the credit with none of the headaches? My white label service lets you offer top-tier web solutions under your own brand, while I handle the heavy lifting behind the scenes. Your clients get seamless results, you get all the applause (and maybe a standing ovation).

Think of me as your digital secret weapon—ready to swoop in, deliver pixel-perfect projects, and then vanish into the night (cape optional). You focus on growing your business, I’ll make sure your reputation stays flawless.`
  }
];

const serviceCardClassName =
  "flex flex-col items-center justify-center bg-transparent border border-white/20 dark:border-zinc-700/30 p-4 sm:p-6 transition hover:scale-95 cursor-pointer min-h-[120px] min-w-0 h-full w-full text-center";

export default function DraggableMosaicServices() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [clickedGlitch, setClickedGlitch] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Generate random glitch intervals for each card, only once per mount
  const glitchIntervals = useMemo(() => [
    Math.floor(Math.random() * 2000) + 1000,
    Math.floor(Math.random() * 2000) + 1000,
    Math.floor(Math.random() * 2000) + 1000,
    Math.floor(Math.random() * 2000) + 1000,
  ], []);




  const { isDark } = useContext(ThemeContext);
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isDark) {
      timeout = setTimeout(() => setShowVideo(true), 1000);
    } else {
      setShowVideo(false);
    }
    return () => clearTimeout(timeout);
  }, [isDark]);

  // Reset glitch state when overlay closes
  useEffect(() => {
    if (openIdx === null) setClickedGlitch(null);
  }, [openIdx]);

  return (
    <div
      ref={constraintsRef}
      className="relative w-screen h-[calc(90vh+40px)] flex items-start md:items-center justify-center pt-2 md:pt-0 overflow-hidden select-none border border-white/20 dark:border-zinc-700/30"
    >
      {/* Dark mode: show video after delay, Light mode: show light grey background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="block dark:hidden w-full h-full bg-transparent" />
        <AnimatePresence>
          {showVideo && (
            <motion.video
              key="services-bg-video"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="hidden dark:block absolute inset-1/2 z-0 -translate-x-1/2 -translate-y-1/2 object-cover w-[80vw] h-[60vh] max-w-3xl max-h-[70vh] rounded-xl shadow-2xl pointer-events-none"
              src={withBasePath("/digital-2.mp4")}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none bg-transparent" />
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        className="relative z-20 grid grid-cols-2 md:grid-cols-3 grid-rows-3 gap-0 w-full h-[60vh]"
        style={{ touchAction: 'none', cursor: 'grab' }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {/* Card 1: UI/UX Design */}
        <div
          className={serviceCardClassName}
          onClick={() => { setOpenIdx(0); setClickedGlitch(0); }}
        >
          <GlitchTitle
            as="span"
            className={`text-2xl sm:text-4xl font-bold mb-2 font-mono${openIdx === 0 ? ' force-glitch' : ''}${clickedGlitch === 0 ? ' glitch' : ''}`}
            fixedInterval={glitchIntervals[0]}
          >
            {services[0].title}
          </GlitchTitle>
        </div>
        {/* Card 2: Web Development */}
        <div
          className={serviceCardClassName}
          onClick={() => { setOpenIdx(1); setClickedGlitch(1); }}
        >
          <GlitchTitle
            as="span"
            className={`text-2xl sm:text-4xl font-bold mb-2 font-mono${openIdx === 1 ? ' force-glitch' : ''}${clickedGlitch === 1 ? ' glitch' : ''}`}
            fixedInterval={glitchIntervals[1]}
          >
            {services[1].title}
          </GlitchTitle>
        </div>
        {/* Card 3: Consulting */}
        <div
          className={serviceCardClassName}
          onClick={() => { setOpenIdx(2); setClickedGlitch(2); }}
        >
          <GlitchTitle
            as="span"
            className={`text-2xl sm:text-4xl font-bold mb-2 font-mono${openIdx === 2 ? ' force-glitch' : ''}${clickedGlitch === 2 ? ' glitch' : ''}`}
            fixedInterval={glitchIntervals[2]}
          >
            {services[2].title}
          </GlitchTitle>
        </div>
        {/* Card 4: SEO */}
        <div
          className={serviceCardClassName}
          onClick={() => { setOpenIdx(3); setClickedGlitch(3); }}
        >
          <GlitchTitle
            as="span"
            className={`text-2xl sm:text-4xl font-bold mb-2 font-mono${openIdx === 3 ? ' force-glitch' : ''}${clickedGlitch === 3 ? ' glitch' : ''}`}
            fixedInterval={glitchIntervals[3]}
          >
            {services[3].title}
          </GlitchTitle>
        </div>

        {/* Card 5: White Label */}
        <div
          className={serviceCardClassName}
          onClick={() => { setOpenIdx(4); setClickedGlitch(4); }}
        >
          <GlitchTitle
            as="span"
            className={`text-2xl sm:text-4xl font-bold mb-2 font-mono${openIdx === 4 ? ' force-glitch' : ''}${clickedGlitch === 4 ? ' glitch' : ''}`}
            fixedInterval={glitchIntervals[3]}
          >
            {services[4].title}
          </GlitchTitle>
        </div>
      </motion.div>
      {/* Overlay Popup */}
      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 dark:bg-zinc-900/30 backdrop-blur-2xl border border-white/20 dark:border-zinc-700/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIdx(null)}
          >
            <motion.div
              className="relative bg-white/80 dark:bg-zinc-900/80 border border-white/30 dark:border-zinc-700/40 shadow-2xl p-12 max-w-3xl w-full mx-4 backdrop-blur-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.18 } }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-6 text-4xl text-zinc-700 dark:text-zinc-200 hover:text-[#a78bfa] focus:outline-none"
                onClick={() => setOpenIdx(null)}
                aria-label="Close service description"
              >
                ×
              </button>
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-zinc-700 dark:text-zinc-200 text-lg sm:text-xl font-normal font-mono text-center mt-2">{services[openIdx]?.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
