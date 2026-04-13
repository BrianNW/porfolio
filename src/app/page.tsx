
"use client";

import GlitchDivider from "../components/GlitchDivider";
import GlitchTitle from "../components/GlitchTitle";
import TypewriterText from "../components/TypewriterText";


import { useState, useRef, useEffect, useContext } from "react";

function ContactOverlay({ open, onClose, form, setForm, submitted, setSubmitted }: {
  open: boolean;
  onClose: () => void;
  form: { name: string; email: string; message: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center p-8 bg-white/70 dark:bg-zinc-900/80 shadow-2xl border border-white/30 dark:border-zinc-700/40 backdrop-blur-xl"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } }}
            exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.18 } }}
          >
            <div className="w-full max-w-lg mx-auto relative">
              <button
                className="absolute -top-4 right-4 text-5xl text-zinc-700 dark:text-zinc-200 hover:text-[#a78bfa] focus:outline-none leading-none"
                onClick={onClose}
                aria-label="Close contact form"
              >
                ×
              </button>
              {submitted ? (
                <div className="text-green-600 dark:text-green-400 text-center py-8">Thank you! Message sent.</div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setSubmitted(true);
                    setTimeout(() => {
                      setForm({ name: "", email: "", message: "" });
                      setSubmitted(false);
                      onClose();
                    }, 1500);
                  }}
                  className="flex flex-col gap-4 w-full"
                >
                  <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Name
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      className="border px-3 py-2 bg-zinc-100/80 dark:bg-zinc-800/80 text-black dark:text-white mt-1 w-full"
                    />
                  </label>
                  <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Email
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                      className="border px-3 py-2 bg-zinc-100/80 dark:bg-zinc-800/80 text-black dark:text-white mt-1 w-full"
                    />
                  </label>
                  <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Message
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      required
                      className="border px-3 py-2 bg-zinc-100/80 dark:bg-zinc-800/80 text-black dark:text-white mt-1 w-full"
                      rows={4}
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-[#a78bfa] hover:bg-[#c4a5fa] text-white font-semibold py-2 transition"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import ThemeToggle from "../components/ThemeToggle";
import PricingCalculatorModal from "../components/PricingCalculatorModal";
import ArrowProgress from "../components/ArrowProgress";
import CarouselProjects from "../components/CarouselProjects";
import VerticalCarouselProjects from "../components/VerticalCarouselProjects";
import VerticalCarouselServices from "../components/VerticalCarouselServices";
import MobileProjectsTitleModal from "./MobileProjectsTitleModal";
// import MobileServicesTitleModal from "./MobileServicesTitleModal";
import { ThemeContext } from "../components/ClientLayout";

// --- 1-column Services section with dismissible title ---
function ServicesSection1Col() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen w-full max-w-2xl px-4 py-32 mx-auto" style={{ background: 'transparent' }}>
      <GlitchTitle as="h2" className="text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-8">Services</GlitchTitle>
      <VerticalCarouselServices />
    </section>
  );
}

// Portrait with slide-in animation and larger size
function PortraitSlideIn() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      className={`flex flex-col items-center justify-center transition-transform duration-1000 ease-out ${visible ? 'translate-x-0 opacity-100' : '-translate-x-32 opacity-0'}`}
    >
      <div className="relative rounded-full ring-4 ring-[#a78bfa33] border border-[#a78bfa22] bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md shadow-xl portrait-glow">
        <Image
          src="/portrait2.jpg"
          alt="Portrait"
          width={420}
          height={420}
          className="object-cover rounded-full w-56 h-56 md:w-[420px] md:h-[420px]"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}

export default function Home() {
  // All state and refs at the very top
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  // FAQ accordion state: index of open item, or null
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [contactOpen, setContactOpen] = useState(false);
  // Remove containerRef and scroll logic for flip animation
  const fullText = "Hi, I'm a Web Developer.\nLet's build something amazing together.";
  const [typed, setTyped] = useState("");
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setTyped("");
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTyped(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Flip animation direction
  const [direction, setDirection] = useState(0);
  const flipToSection = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  // Section definitions (must be after all state/vars and helpers)
  const sections = [
    {
      key: "home",
      content: (
        <main className="w-full h-screen flex items-stretch bg-white dark:bg-black transition-colors duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)] min-h-0 absolute top-0 left-0" style={{ background: 'transparent' }}>
          {/* 2 columns, each 50% width, 100vh height */}
          <div className="w-1/2 h-full flex items-stretch justify-center bg-white dark:bg-zinc-900 min-h-0">
            <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left max-w-lg w-full mr-0 ml-auto h-full min-h-0 justify-center px-5 sm:px-8">
              <GlitchTitle as="h1" glitchClassName="glitch-chromatic" className="max-w-full text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight whitespace-pre-line text-center md:text-left">
                {typed}
                {typed.length < fullText.length && <span className="animate-pulse">|</span>}
              </GlitchTitle>
              <div className="w-3/5 md:w-2/5 flex justify-center md:justify-start mt-2 mb-4">
                <GlitchDivider />
              </div>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400 font-normal">
                I design and develop modern, responsive websites for businesses and individuals. Explore my work, get a quote, or contact me below.
              </p>
              <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full md:w-auto">
                <button
                  className="btn-glitch btn-glass-purple flex h-12 w-full items-center justify-center md:justify-start text-white px-7 transition-colors md:w-[170px]"
                  onClick={() => setContactOpen(true)}
                  type="button"
                >
                  <GlitchTitle glitchClassName="glitch-chromatic" className="text-zinc-800 dark:text-white text-xl text-center md:text-left whitespace-nowrap w-full">Contact Me</GlitchTitle>
                </button>
              </div>
            </div>
          </div>
          {/* Right column: portrait */}
          <div className="w-1/2 h-full flex items-stretch justify-center relative overflow-hidden min-h-0">
            {/* Blurred, darkened background image */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image src="/portrait2.jpg" alt="Portrait background" fill className="object-cover w-full h-full blur-2xl brightness-50" priority unoptimized />
            </div>
            <div className="flex flex-col items-center justify-center w-full h-full min-h-0 z-10">
              <PortraitSlideIn />
            </div>
          </div>
        </main>
      ),
    },
    {
      key: "about",
      content: (
        <section className="flex flex-col items-center justify-center min-h-screen w-full max-w-3xl px-8 py-32 bg-white dark:bg-zinc-900 mx-auto" style={{ background: 'transparent' }}>
          <GlitchTitle as="h2" className="text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-8">About Me</GlitchTitle>
          <TypewriterText className="text-base md:text-lg lg:text-xl font-normal text-zinc-700 dark:text-zinc-200 text-center max-w-xl" speed={45}>
            I’m a passionate web developer and designer with a love for crafting beautiful, user-friendly digital experiences. I specialize in building modern, responsive websites that help businesses and individuals stand out online. My approach combines clean design, accessibility, and performance to deliver results you’ll love.
          </TypewriterText>
        </section>
      ),
    },
    {
      key: "projects",
      content: (
        <section className="relative flex flex-col md:flex-row items-stretch justify-center min-h-screen w-full max-w-5xl px-0 md:px-4 py-0 md:py-32 mx-auto" style={{ background: 'transparent' }}>
          {/* Overlay modal for title on mobile */}
          <MobileProjectsTitleModal />
          {/* Desktop layout */}
            <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/3 pr-0 md:pr-12">
              {/* <h2 className="section-title-glitch text-left md:text-right mb-0">Past Projects</h2> */}
            {/* Mobile: glass background, Desktop: normal */}
            <GlitchTitle as="h2" glitchClassName="glitch-chromatic" className="title-glass-black md:hidden text-zinc-700 !text-[#18181b] dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-left md:text-right mb-0">Past Projects</GlitchTitle>
            <GlitchTitle as="h2" className="hidden md:inline-block text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-left md:text-right mb-0">Past Projects</GlitchTitle>
          </div>
          <div className="flex-1 h-full flex items-center">
            <VerticalCarouselProjects />
          </div>
        </section>
      )
    },
    {
      key: "services",
      content: <ServicesSection1Col />,
    },
    {
      key: "faq",
      content: (
        <section className="flex flex-col items-center justify-center min-h-screen w-full max-w-3xl px-8 py-32 bg-white dark:bg-zinc-900 mx-auto" style={{ background: 'transparent' }}>
          {/* <h2 className="section-title-glitch text-center">FAQ</h2> */}
            <GlitchTitle as="h2" className="text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-8">FAQ</GlitchTitle>
          <div className="w-full max-w-2xl divide-y divide-zinc-200 dark:divide-zinc-700 rounded-xl overflow-hidden shadow-lg">
            {[
              {
                q: 'What services do you offer?',
                a: 'I offer web design, development, UI/UX, and consulting services tailored to your needs.'
              },
              {
                q: 'Are you available for retained services?',
                a: 'Yes, I am available for ongoing and retained engagements. Contact me to discuss your requirements.'
              },
              {
                q: 'Do you work with clients outside the Canada?',
                a: 'Absolutely! I work with clients globally, not just in Canada.'
              },
              {
                q: 'How does pricing work?',
                a: null // handled below
              }
            ].map((item, idx) => (
              <div key={item.q}>
                <button
                  className="w-full flex justify-between items-center py-6 px-4 focus:outline-none bg-transparent"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span className="text-2xl font-bold text-[#4c1d95] dark:text-[#a78bfa] text-left">{item.q}</span>
                  <span className="ml-4 text-3xl text-[#a78bfa] dark:text-[#4c1d95]">{openFaq === idx ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden px-4 pb-6"
                    >
                      {item.a ? (
                        <p className="text-lg text-zinc-700 dark:text-zinc-200 font-normal">{item.a}</p>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-lg text-zinc-700 dark:text-zinc-200 font-normal">Pricing is project-based or retainer-based, depending on your needs. Get in touch for a custom quote or use the calculator below.</p>
                          <button
                            type="button"
                            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-10 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] text-black dark:text-white font-medium"
                            onClick={() => setPricingOpen(true)}
                          >
                            Pricing Calculator
                          </button>
                          <PricingCalculatorModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      key: "contact",
      content: (
        <section id="contact" className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl px-8 py-32 bg-white dark:bg-zinc-900 mx-auto" style={{ background: 'transparent' }}>
          {/* <h2 className="section-title-glitch text-center">Contact Me</h2> */}
            <GlitchTitle as="h2" className="text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-8">Contact Me</GlitchTitle>
          {submitted ? (
            <div className="text-green-600 dark:text-green-400 text-center py-8">Thank you! Message sent.</div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); setTimeout(() => { setForm({ name: "", email: "", message: "" }); setSubmitted(false); }, 1500); }} className="flex flex-col gap-4 w-full">
              <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mt-1 w-full"
                />
              </label>
              <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Email
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mt-1 w-full"
                />
              </label>
              <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Message
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mt-1 w-full"
                  rows={4}
                />
              </label>
              <button
                type="submit"
                className="bg-[#a78bfa] hover:bg-[#c4a5fa] text-white font-semibold py-2 rounded transition"
              >
                Send
              </button>
            </form>
          )}
        </section>
      ),
    },
  ];

  // --- RENDER ---


  return (
    <>
      <ContactOverlay
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        form={form}
        setForm={setForm}
        submitted={submitted}
        setSubmitted={setSubmitted}
      />
      <div className="relative z-10 min-h-screen w-full bg-white dark:bg-black transition-colors duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)]">
        {/* AnimatedBackground is now handled in ClientLayout */}
        {/* Persistent cyberpunk glitchy animated progress bar only */}
        <div className="fixed left-0 right-0 bottom-0 z-50 w-full pointer-events-none">
          <ArrowProgress current={current} total={sections.length} />
        </div>
        {/* Theme toggle and pricing modal */}
        <div className="absolute top-6 right-8 z-50 flex gap-4">
          <ThemeToggle onThemeChange={setIsDark} />
          <PricingCalculatorModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
        </div>
        {/* Section navigation arrows */}
        {/* Section navigation arrows: bottom on mobile, side on desktop */}
        <div>
          {/* Mobile: bottom fixed above progress bar */}
          <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-between items-center px-8 md:hidden pointer-events-none">
            {current > 0 && (
              <button
                className="p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition pointer-events-auto"
                style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
                onClick={() => flipToSection(current - 1)}
                aria-label="Scroll Left"
              >
                <span className="text-3xl text-[#a78bfa]">&#8592;</span>
              </button>
            )}
            {current < sections.length - 1 && (
              <button
                className="p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition pointer-events-auto"
                style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
                onClick={() => flipToSection(current + 1)}
                aria-label="Scroll Right"
              >
                <span className="text-3xl text-[#a78bfa]">&#8594;</span>
              </button>
            )}
          </div>
          {/* Desktop: side center as before */}
          {current > 0 && (
            <button
              className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition"
              style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
              onClick={() => flipToSection(current - 1)}
              aria-label="Scroll Left"
            >
              <span className="text-3xl text-[#a78bfa]">&#8592;</span>
            </button>
          )}
          {current < sections.length - 1 && (
            <button
              className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition"
              style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
              onClick={() => flipToSection(current + 1)}
              aria-label="Scroll Right"
            >
              <span className="text-3xl text-[#a78bfa]">&#8594;</span>
            </button>
          )}
        </div>
        {/* Book-style flip animation container */}
        <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={sections[current].key}
              className="absolute w-full h-full flex flex-col items-center justify-center"
              custom={direction}
              initial={{ rotateY: direction > 0 ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ rotateY: direction > 0 ? 90 : -90, opacity: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
              style={{ perspective: 1200, backfaceVisibility: "hidden" }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center" style={{ minWidth: "100vw", minHeight: "100vh" }}>
                {sections[current].content}
                {/* Animated divider during transition */}
                {current < sections.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.7 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0.7 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <GlitchDivider />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
