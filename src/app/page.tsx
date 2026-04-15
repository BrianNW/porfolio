
"use client";

import GlitchDivider from "../components/GlitchDivider";
import GlitchTitle from "../components/GlitchTitle";
import TypewriterText from "../components/TypewriterText";
import {
  emptyContactCaptcha,
  emptyContactForm,
  fetchContactCaptchaChallenge,
  submitContactForm,
} from "@/lib/contact";


import { useState, useEffect, useContext, useRef } from "react";

function ContactOverlay({
  open,
  onClose,
  form,
  setForm,
  submitted,
  submitError,
  captcha,
  captchaAnswer,
  setCaptchaAnswer,
  isCaptchaLoading,
  captchaError,
  onRefreshCaptcha,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  form: { name: string; email: string; message: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  submitted: boolean;
  submitError: string | null;
  captcha: { prompt: string; token: string };
  captchaAnswer: string;
  setCaptchaAnswer: React.Dispatch<React.SetStateAction<string>>;
  isCaptchaLoading: boolean;
  captchaError: string | null;
  onRefreshCaptcha: () => Promise<void>;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
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
                  onSubmit={onSubmit}
                  className="flex flex-col gap-4 w-full"
                >
                  {submitError ? (
                    <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
                      {submitError}
                    </div>
                  ) : null}
                  <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Name
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                      required
                      className="border px-3 py-2 bg-zinc-100/80 dark:bg-zinc-800/80 text-black dark:text-white mt-1 w-full"
                      rows={4}
                    />
                  </label>
                  <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                    <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Security Check
                      <span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300">
                        {isCaptchaLoading ? "Loading captcha..." : captcha.prompt || "Load the captcha to continue."}
                      </span>
                      <input
                        type="text"
                        name="captchaAnswer"
                        inputMode="numeric"
                        placeholder="Answer"
                        value={captchaAnswer}
                        onChange={event => setCaptchaAnswer(event.target.value)}
                        disabled={isSubmitting || isCaptchaLoading || !captcha.token}
                        required
                        className="border px-3 py-2 bg-zinc-100/80 dark:bg-zinc-800/80 text-black dark:text-white mt-2 w-full"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void onRefreshCaptcha()}
                      disabled={isSubmitting || isCaptchaLoading}
                      className="border px-3 py-2 text-sm text-black transition hover:bg-black/[.04] dark:text-white dark:hover:bg-white/[.08]"
                    >
                      Refresh
                    </button>
                  </div>
                  {captchaError ? (
                    <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
                      {captchaError}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isSubmitting || isCaptchaLoading || !captcha.token}
                    className="bg-[#a78bfa] hover:bg-[#c4a5fa] text-white font-semibold py-2 transition"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
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
import ThemeToggle from "../components/ThemeToggle";
import PricingCalculatorModal from "../components/PricingCalculatorModal";
import ArrowProgress from "../components/ArrowProgress";
import VerticalCarouselProjects from "../components/VerticalCarouselProjects";
import DraggableMosaicServices from "../components/DraggableMosaicServices";
import MobileProjectsTitleModal from "./MobileProjectsTitleModal";
// import MobileServicesTitleModal from "./MobileServicesTitleModal";
import { ThemeContext } from "../components/ClientLayout";

// Portrait with slide-in animation and larger size
function PortraitVideo({ className, blurred = false }: { className: string; blurred?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let replayTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const scheduleReplay = () => {
      const nextDelay = Math.floor(Math.random() * 4000) + 3000;

      replayTimeout = setTimeout(() => {
        if (cancelled || !videoRef.current) {
          return;
        }

        videoRef.current.currentTime = 0;
        void videoRef.current.play().catch(() => undefined);
        scheduleReplay();
      }, nextDelay);
    };

    if (videoRef.current) {
      void videoRef.current.play().catch(() => undefined);
    }

    scheduleReplay();

    return () => {
      cancelled = true;
      if (replayTimeout) {
        clearTimeout(replayTimeout);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={`${className} ${blurred ? "blur-2xl brightness-50" : ""}`.trim()}
      src="/portrait1.mp4"
    />
  );
}

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
      <div className="relative overflow-hidden rounded-full ring-4 ring-[#a78bfa33] border border-[#a78bfa22] bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md shadow-xl portrait-glow">
        <PortraitVideo className="object-cover rounded-full scale-125 w-56 h-56 md:w-[420px] md:h-[420px]" />
      </div>
    </div>
  );
}

export default function Home() {
    // Animation direction for flip
    const [direction, setDirection] = useState(0);

    // Handler for flipping between sections
    function flipToSection(nextIdx: number) {
      setDirection(nextIdx > current ? 1 : -1);
      setCurrent(nextIdx);
    }
  // All state and refs at the very top
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState(emptyContactForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState(emptyContactCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  // FAQ accordion state: index of open item, or null
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [contactOpen, setContactOpen] = useState(false);
  const [showArrowCue, setShowArrowCue] = useState(false);
  // Remove containerRef and scroll logic for flip animation
  const fullText = "I architect digital experiences.\nTogether, let’s translate your vision into a living reality";

  useEffect(() => {
    let cueTimeout: ReturnType<typeof setTimeout> | null = null;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const scheduleCue = () => {
      const nextDelay = Math.floor(Math.random() * 4000) + 1000;

      cueTimeout = setTimeout(() => {
        if (cancelled) {
          return;
        }

        setShowArrowCue(true);

        resetTimeout = setTimeout(() => {
          if (cancelled) {
            return;
          }

          setShowArrowCue(false);
          scheduleCue();
        }, 850);
      }, nextDelay);
    };

    scheduleCue();

    return () => {
      cancelled = true;
      if (cueTimeout) {
        clearTimeout(cueTimeout);
      }
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, []);

  const refreshCaptcha = async () => {
    setIsCaptchaLoading(true);
    setCaptchaError(null);

    try {
      const challenge = await fetchContactCaptchaChallenge();
      setCaptcha(challenge);
    } catch (error) {
      setCaptcha(emptyContactCaptcha);
      setCaptchaError(
        error instanceof Error ? error.message : "Unable to load captcha right now."
      );
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshCaptcha();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!captcha.token) {
      setSubmitError("Captcha is still loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactForm({
        ...form,
        captchaAnswer,
        captchaToken: captcha.token,
      });
      setSubmitted(true);
      setForm(emptyContactForm);
      setCaptchaAnswer("");
      void refreshCaptcha();
      setTimeout(() => {
        setSubmitted(false);
        setContactOpen(false);
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send your message right now.";

      setSubmitError(message);

      if (/captcha/i.test(message)) {
        setCaptchaAnswer("");
        void refreshCaptcha();
      }
    } finally {
      setIsSubmitting(false);
    }
  }


  const sections = [
    {
      key: "home",
      content: (
        <main className="relative flex flex-col md:flex-row items-stretch justify-center min-h-screen w-full bg-white/80 dark:bg-zinc-900/80 overflow-hidden" style={{ background: 'transparent' }}>
          {/* Left column: animated typewriter and video background in dark mode */}
            <div className="relative flex flex-col gap-6 items-center md:items-start text-center md:text-left w-full md:w-1/2 h-full min-h-[60vh] md:min-h-0 justify-center px-4 md:pl-12 sm:px-6 z-10">
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 z-0 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm pointer-events-none" />
            <GlitchTitle as="h1" glitchClassName="glitch-chromatic" className="hero-home-title hero-main-glitch relative max-w-full text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight whitespace-pre-line text-center md:text-left force-glitch">
              <TypewriterText className="whitespace-pre-line">
                {fullText}
              </TypewriterText>
            </GlitchTitle>
            <div className="relative w-3/5 md:w-2/5 flex justify-center md:justify-start mt-2 mb-4">
              <GlitchDivider />
            </div>
            <div className="relative w-full flex flex-col items-center md:items-start">
              <div className="absolute inset-0 w-full h-full rounded-xl bg-white/90 dark:bg-zinc-900/90 z-0" />
              <p className="relative z-10 max-w-md text-base sm:text-base md:text-lg leading-6 text-zinc-600 dark:text-zinc-200 font-mono">
              I design and develop modern, responsive websites for businesses and individuals. Explore my work, get a quote, or contact me below.
            </p>
            </div>
            <div className="relative flex flex-col gap-4 text-base font-medium sm:flex-row w-full md:w-auto mt-4">
              <div className="absolute inset-0 w-full h-full rounded-xl bg-white/90 dark:bg-zinc-900/90 z-0" />
              <button
                className="relative z-10 btn-glitch btn-glass-purple flex h-12 w-full items-center justify-center md:justify-start text-white px-7 transition-colors md:w-[170px]"
                onClick={() => setContactOpen(true)}
                type="button"
              >
                <GlitchTitle glitchClassName="glitch-chromatic" className="text-zinc-800 dark:text-white text-base font-normal leading-tight truncate whitespace-nowrap w-full">Contact Me</GlitchTitle>
              </button>
            </div>
            {/* Cyberpunk video background (dark mode only, left column only) */}
            {isDark && (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none rounded-2xl"
                src="/cyberpunk.mp4"
              />
            )}
          </div>
          {/* Right column: portrait */}
            <div className="w-full md:w-1/2 h-full flex items-stretch justify-center relative overflow-hidden min-h-[40vh] md:min-h-0">
            {/* Blurred, darkened background image */}
            <div className="absolute inset-0 w-full h-full z-0">
              <PortraitVideo className="object-cover w-full h-full" blurred />
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
        <section className="relative flex flex-col items-center justify-center min-h-screen w-full max-w-3xl px-8 py-32 bg-transparent mx-auto overflow-hidden" style={{ background: 'transparent' }}>
          <GlitchTitle as="h2" className="hero-main-glitch force-glitch relative z-10 text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-8">About Me</GlitchTitle>
          <TypewriterText className="text-lg md:text-xl lg:text-2xl font-mono text-center max-w-xl mt-2 text-zinc-700 dark:text-zinc-200">
            I’m a passionate web developer and designer with a love for crafting beautiful, user-friendly digital experiences. I specialize in building modern, responsive websites that help businesses and individuals stand out online. My approach combines clean design, accessibility, and performance to deliver results you’ll love.
          </TypewriterText>
        </section>
      ),
    },
    {
      key: "projects",
      content: (
        <section className="relative flex flex-col md:flex-row items-stretch justify-center min-h-screen w-full max-w-5xl px-0 md:px-4 py-0 md:py-32 mx-auto overflow-hidden" style={{ background: 'transparent' }}>
          {/* Cyberpunk video background (dark mode only) */}
          {isDark && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="fixed top-0 left-0 w-screen h-screen object-cover z-0 opacity-60 pointer-events-none"
              src="/cyberpunk.mp4"
            />
          )}
          {/* Overlay modal for title on mobile */}
          <MobileProjectsTitleModal />
          {/* Desktop layout */}
            <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/3 pr-0 md:pr-12 bg-black md:bg-transparent">
              {/* <h2 className="section-title-glitch text-left md:text-right mb-0">Past Projects</h2> */}
            {/* Mobile: glass background, Desktop: normal */}
            <GlitchTitle as="h2" glitchClassName="glitch-chromatic" className="hero-main-glitch force-glitch md:hidden text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-left md:text-right mb-0">Past Projects</GlitchTitle>
            <GlitchTitle as="h2" className="hero-main-glitch force-glitch hidden md:inline-block text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-left md:text-right mb-0">Past Projects</GlitchTitle>
          </div>
          <div className="flex-1 h-full flex items-center">
            <VerticalCarouselProjects />
          </div>
        </section>
      )
    },
    {
      key: "services",
      content: (
        <section className="relative flex flex-col items-center justify-center min-h-screen w-full px-0 py-32 mx-0 bg-transparent overflow-hidden" style={{ background: 'transparent' }}>
          {/* Cyberpunk video background (dark mode only) */}
          {isDark && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="fixed top-0 left-0 w-screen h-screen object-cover z-0 opacity-60 pointer-events-none"
              src="/cyberpunk.mp4"
            />
          )}
          <GlitchTitle as="h2" className="hero-main-glitch force-glitch relative z-10 mb-8 text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center">Services</GlitchTitle>
          <DraggableMosaicServices />
        </section>
      ),
    },
    {
      key: "faq",
      content: (
        <section className="relative flex flex-col items-center justify-center min-h-screen w-full max-w-3xl px-8 py-32 bg-transparent mx-auto overflow-hidden" style={{ background: 'transparent' }}>
          <GlitchTitle as="h2" className="hero-main-glitch force-glitch relative z-10 text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-8">FAQ</GlitchTitle>
          <div className="relative z-10 w-full max-w-2xl divide-y divide-zinc-200 dark:divide-zinc-700 rounded-xl overflow-hidden shadow-lg">
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
                  <GlitchTitle as="span" glitchClassName="glitch-chromatic" className="text-2xl font-bold text-left font-mono">{item.q}</GlitchTitle>
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
                        <p className="text-lg text-zinc-700 dark:text-zinc-200 font-mono">{item.a}</p>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-lg text-zinc-700 dark:text-zinc-200 font-mono">Pricing is project-based or retainer-based, depending on your needs. Get in touch for a custom quote or use the calculator below.</p>
                          <button
                            type="button"
                            className="flex h-12 w-full items-center justify-center border border-solid border-black/[.08] px-10 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] text-black dark:text-white font-medium"
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
        <section id="contact" className="relative flex flex-col items-center justify-center min-h-screen w-full max-w-2xl px-8 py-32 bg-transparent mx-auto overflow-hidden">
          {/* <h2 className="section-title-glitch text-center">Contact Me</h2> */}
            <GlitchTitle as="h2" className="hero-main-glitch force-glitch relative z-10 text-zinc-800 dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-8">Contact Me</GlitchTitle>
          {submitted ? (
            <div className="text-green-600 dark:text-green-400 text-center py-8">Thank you! Message sent.</div>
          ) : (
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 w-full">
              {submitError ? (
                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
                  {submitError}
                </div>
              ) : null}
              <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  required
                  className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mt-1 w-full"
                  rows={4}
                />
              </label>
              <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                <label className="text-zinc-700 dark:text-white font-light" style={{ fontWeight: 300 }}>Security Check
                  <span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300">
                    {isCaptchaLoading ? "Loading captcha..." : captcha.prompt || "Load the captcha to continue."}
                  </span>
                  <input
                    type="text"
                    name="captchaAnswer"
                    inputMode="numeric"
                    placeholder="Answer"
                    value={captchaAnswer}
                    onChange={event => setCaptchaAnswer(event.target.value)}
                    disabled={isSubmitting || isCaptchaLoading || !captcha.token}
                    required
                    className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mt-2 w-full"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void refreshCaptcha()}
                  disabled={isSubmitting || isCaptchaLoading}
                  className="rounded border px-3 py-2 text-sm text-black transition hover:bg-black/[.04] dark:text-white dark:hover:bg-white/[.08]"
                >
                  Refresh
                </button>
              </div>
              {captchaError ? (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
                  {captchaError}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting || isCaptchaLoading || !captcha.token}
                className="bg-[#a78bfa] hover:bg-[#c4a5fa] text-white font-semibold py-2 rounded transition"
              >
                {isSubmitting ? "Sending..." : "Send"}
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
        submitError={submitError}
        captcha={captcha}
        captchaAnswer={captchaAnswer}
        setCaptchaAnswer={setCaptchaAnswer}
        isCaptchaLoading={isCaptchaLoading}
        captchaError={captchaError}
        onRefreshCaptcha={refreshCaptcha}
        isSubmitting={isSubmitting}
        onSubmit={handleContactSubmit}
      />
      <div className="relative z-10 min-h-screen w-full bg-white dark:bg-black transition-colors duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)]">
        {/* Static cyberpunk video background for About, FAQ, Contact */}
        {isDark && ["about", "faq", "contact"].includes(sections[current].key) && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed top-0 left-0 w-screen h-screen object-cover z-0 opacity-60 pointer-events-none"
            src="/cyberpunk.mp4"
          />
        )}
        {/* Persistent cyberpunk glitchy animated progress bar only */}
        <div className="fixed left-0 right-0 bottom-0 z-50 w-full pointer-events-none">
          <ArrowProgress current={current} total={sections.length} />
        </div>
        {/* Theme toggle and pricing modal */}
        <div className="absolute top-6 right-8 z-50 flex gap-4">
          <ThemeToggle onThemeChange={setIsDark} />
          <PricingCalculatorModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
        </div>
        {/* Section navigation arrows: bottom on mobile, side on desktop */}
        <div>
          {/* Mobile: bottom fixed above progress bar */}
          <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-between items-center px-8 md:hidden pointer-events-none">
            {current > 0 && (
              <button
                className={`nav-arrow-button p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition pointer-events-auto ${showArrowCue ? "nav-arrow-cue" : ""}`}
                style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
                onClick={() => flipToSection(current - 1)}
                aria-label="Scroll Left"
              >
                <span className={`nav-arrow-shell ${showArrowCue ? "nav-arrow-shell-cue" : ""}`}>
                  <span className={`nav-arrow-icon text-3xl text-[#a78bfa] ${showArrowCue ? "nav-arrow-icon-cue" : ""}`}>&#8592;</span>
                </span>
              </button>
            )}
            {current < sections.length - 1 && (
              <button
                className={`nav-arrow-button p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition pointer-events-auto ${showArrowCue ? "nav-arrow-cue" : ""}`}
                style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
                onClick={() => flipToSection(current + 1)}
                aria-label="Scroll Right"
              >
                <span className={`nav-arrow-shell ${showArrowCue ? "nav-arrow-shell-cue" : ""}`}>
                  <span className={`nav-arrow-icon text-3xl text-[#a78bfa] ${showArrowCue ? "nav-arrow-icon-cue" : ""}`}>&#8594;</span>
                </span>
              </button>
            )}
          </div>
          {/* Desktop: side center as before */}
          {current > 0 && (
            <button
              className={`nav-arrow-button hidden md:block absolute left-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition ${showArrowCue ? "nav-arrow-cue" : ""}`}
              style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
              onClick={() => flipToSection(current - 1)}
              aria-label="Scroll Left"
            >
              <span className={`nav-arrow-shell ${showArrowCue ? "nav-arrow-shell-cue" : ""}`}>
                <span className={`nav-arrow-icon text-3xl text-[#a78bfa] ${showArrowCue ? "nav-arrow-icon-cue" : ""}`}>&#8592;</span>
              </span>
            </button>
          )}
          {current < sections.length - 1 && (
            <button
              className={`nav-arrow-button hidden md:block absolute right-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/10 border border-white/40 dark:border-zinc-700/20 hover:bg-white/60 dark:hover:bg-zinc-800/20 transition ${showArrowCue ? "nav-arrow-cue" : ""}`}
              style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
              onClick={() => flipToSection(current + 1)}
              aria-label="Scroll Right"
            >
              <span className={`nav-arrow-shell ${showArrowCue ? "nav-arrow-shell-cue" : ""}`}>
                <span className={`nav-arrow-icon text-3xl text-[#a78bfa] ${showArrowCue ? "nav-arrow-icon-cue" : ""}`}>&#8594;</span>
              </span>
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
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ minWidth: "100vw", minHeight: "100vh" }}>
                {sections[current].content}
                {/* Animated divider during transition */}
                {current < sections.length - 1 && (
                  <motion.div
                    className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
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
