"use client";

import { createContext, useState, useMemo, useEffect } from "react";
import AnimatedBackground from "./AnimatedBackground";

export const ThemeContext = createContext<{ isDark: boolean; setIsDark: (v: boolean) => void }>({ isDark: false, setIsDark: () => {} });

export default function ClientLayoutProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const value = useMemo(() => ({ isDark, setIsDark }), [isDark]);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
