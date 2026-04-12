
"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import ThemeToggle from "../components/ThemeToggle";

const sections = [
  {
    key: "home",
    content: (
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start min-h-screen">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Hi, I'm a Web Developer.<br />Let's build something amazing together.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            I design and develop modern, responsive websites for businesses and individuals. Explore my work, get a quote, or contact me below.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-white px-5 transition-colors hover:bg-blue-700 md:w-[158px]"
            href="#contact"
          >
            Contact Me
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/pricing"
          >
            Pricing Calculator
          </a>
        </div>
      </main>
    ),
  },
  {
    key: "about",
    content: (
      <section className="flex flex-col items-center justify-center min-h-screen w-full max-w-3xl px-8 py-32 bg-white dark:bg-zinc-900 mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">About Me</h2>
        <p className="text-lg text-zinc-700 dark:text-zinc-200 text-center max-w-xl">
          I’m a passionate web developer and designer with a love for crafting beautiful, user-friendly digital experiences. I specialize in building modern, responsive websites that help businesses and individuals stand out online. My approach combines clean design, accessibility, and performance to deliver results you’ll love.
        </p>
      </section>
    ),
  },
  {
    key: "contact",
    content: null, // Will be filled in the component for stateful form
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fill contact section with form
  const sectionList = [...sections];
  sectionList[2] = {
    ...sectionList[2],
    content: (
      <section id="contact" className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl px-8 py-32 bg-white dark:bg-zinc-900 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Contact Me</h2>
        {submitted ? (
          <div className="text-green-600 dark:text-green-400 text-center py-8">Thank you! Message sent.</div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); setTimeout(() => { setForm({ name: "", email: "", message: "" }); setSubmitted(false); }, 1500); }} className="flex flex-col gap-4 w-full">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
              className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
              rows={4}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              Send
            </button>
          </form>
        )}
      </section>
    ),
  };

  // Scroll logic
  const scrollToSection = (idx: number) => {
    setCurrent(idx);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: idx * containerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-50 dark:bg-black font-sans">
      <ThemeToggle />
      {/* Arrows */}
      {current > 0 && (
        <button
          className="absolute left-10 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/30 dark:bg-zinc-800/30 border border-white/40 dark:border-zinc-700/40 hover:bg-white/50 dark:hover:bg-zinc-800/50 transition"
          style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
          onClick={() => scrollToSection(current - 1)}
          aria-label="Scroll Left"
        >
          <span className="text-3xl text-blue-600 dark:text-blue-400">&#8592;</span>
        </button>
      )}
      {current < sectionList.length - 1 && (
        <button
          className="absolute right-10 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/30 dark:bg-zinc-800/30 border border-white/40 dark:border-zinc-700/40 hover:bg-white/50 dark:hover:bg-zinc-800/50 transition"
          style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
          onClick={() => scrollToSection(current + 1)}
          aria-label="Scroll Right"
        >
          <span className="text-3xl text-blue-600 dark:text-blue-400">&#8594;</span>
        </button>
      )}
      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex flex-row w-full h-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {sectionList.map((section, idx) => (
          <div
            key={section.key}
            className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center"
            style={{ minWidth: "100vw", minHeight: "100vh" }}
          >
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
}
