"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof document !== "undefined") {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  if (!theme) return null;

  return (
    <button
      aria-label="Toggle Light/Dark Mode"
      onClick={toggleTheme}
      className="fixed top-8 right-8 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-white/40 dark:bg-zinc-800/20 border border-white/40 dark:border-zinc-700/30 hover:bg-white/60 dark:hover:bg-zinc-800/30 transition"
      style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
    >
      <span className="text-2xl text-blue-600 dark:text-blue-400">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}
