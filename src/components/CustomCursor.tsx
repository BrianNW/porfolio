"use client";
import { useEffect, useRef, useState } from "react";


export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [hideCursor, setHideCursor] = useState(false);
  const trailLength = 8;
  // Detect dark mode
  const [isDark, setIsDark] = useState(false);

  // Track theme mode
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Mouse move logic for cursor and trail
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const coords = Array(trailLength).fill([mouseX, mouseY]);

    function moveCursor(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX - 11}px, ${mouseY - 11}px, 0)`;
      }
      // Move trail
      coords.unshift([mouseX, mouseY]);
      coords.length = trailLength;
      trailRefs.current.forEach((el, i) => {
        if (el) {
          const [x, y] = coords[i + 1] || [mouseX, mouseY];
          el.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0)`;
        }
      });
    }

    // Hide cursor on input, textarea, contenteditable, or when pointer is over interactive elements
    function handlePointerOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest('input, textarea, [contenteditable="true"], button, a, select, [role="button"], [tabindex]')
      ) {
        setHideCursor(true);
      }
    }
    function handlePointerOut(e: PointerEvent) {
      setHideCursor(false);
    }

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('pointerover', handlePointerOver);
    window.addEventListener('pointerout', handlePointerOut);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, [trailLength]);

  return (
    <>
      {!hideCursor && (
        <>
          <div
            ref={cursorRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: isDark ? "2.5px solid #00ff87" : "2.5px solid #7c3aed",
              background: isDark ? "rgba(0,255,135,0.18)" : "#7c3aed",
              boxShadow: isDark
                ? "0 0 24px 6px #00ff87, 0 0 48px 12px #00ff87cc"
                : "0 0 24px 8px #a78bfa88, 0 0 48px 16px #7c3aed88",
              pointerEvents: "none",
              zIndex: 2147483647,
              mixBlendMode: isDark ? "lighten" : undefined,
              transform: "translate3d(0, 0, 0)",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          />
          {Array.from({ length: trailLength }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el;
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: isDark ? "2.5px solid #00ff87" : "2.5px solid #7c3aed",
                background: isDark ? "rgba(0,255,135,0.10)" : "#7c3aed",
                boxShadow: isDark
                  ? undefined
                  : "0 0 16px 6px #a78bfa88, 0 0 32px 12px #7c3aed88",
                mixBlendMode: isDark ? "lighten" : undefined,
                pointerEvents: "none",
                zIndex: 2147483646,
                opacity: 0.12 + 0.08 * (1 - i / trailLength),
                filter: "blur(8px)",
                transform: "translate3d(0, 0, 0)",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
            />
          ))}
        </>
      )}
    </>
  );
}
