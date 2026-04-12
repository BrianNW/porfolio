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
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
