"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [hideCursor, setHideCursor] = useState(false);
  const trailLength = 8;

  useEffect(() => {
    // Hide custom cursor on interactive elements
    const setPointer = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a,button,[role="button"],input[type="button"],input[type="submit"],.cursor-pointer') ||
        target.closest('input[type="text"],input[type="email"],input[type="password"],textarea,[contenteditable="true"]')
      ) {
        setHideCursor(true);
      } else {
        setHideCursor(false);
      }
    };
    window.addEventListener('pointerover', setPointer);
    window.addEventListener('pointerout', setPointer);
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = mouseX;
    let lastY = mouseY;
    const trailPositions = Array(trailLength).fill([mouseX, mouseY]);

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animate = () => {
      lastX += (mouseX - lastX) * 0.2;
      lastY += (mouseY - lastY) * 0.2;
      trailPositions.unshift([lastX, lastY]);
      trailPositions.length = trailLength;
      trailRefs.current.forEach((el, i) => {
        if (el) {
          const [tx, ty] = trailPositions[i + 1] || [lastX, lastY];
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          el.style.opacity = `${0.08 + (0.12 * (1 - i / trailLength))}`;
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", moveCursor);
    animate();
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener('pointerover', setPointer);
      window.removeEventListener('pointerout', setPointer);
    };
  }, []);

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
              border: "2px solid #00ff87",
              background: "transparent",
              boxShadow: "0 0 16px 2px #00ff8788",
              pointerEvents: "none",
              zIndex: 9999,
              mixBlendMode: "lighten",
              transform: "translate3d(-100px, -100px, 0)",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          />
          {Array.from({ length: trailLength }).map((_, i) => (
            <div
              key={i}
              ref={el => (trailRefs.current[i] = el)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "2px solid #00ff87",
                background: "transparent",
                pointerEvents: "none",
                zIndex: 9998,
                opacity: 0.08 + 0.08 * (1 - i / trailLength),
                filter: "blur(6px)",
                mixBlendMode: "lighten",
                transform: "translate3d(-100px, -100px, 0)",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
            />
          ))}
        </>
      )}
    </>
  );
}
