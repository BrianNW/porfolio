import React from "react";

interface SparkleProps {
  x: number;
  y: number;
}

const Sparkle: React.FC<SparkleProps> = ({ x, y }) => (
  <svg
    style={{
      position: "absolute",
      left: x,
      top: y,
      pointerEvents: "none",
      zIndex: 50,
      width: 32,
      height: 32,
      animation: "sparkle-fade 700ms linear forwards"
    }}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <circle cx="16" cy="16" r="4" fill="#fff" fillOpacity="0.8" />
      <path d="M16 2v6M16 24v6M2 16h6M24 16h6M8.2 8.2l4.2 4.2M19.6 19.6l4.2 4.2M8.2 23.8l4.2-4.2M19.6 12.4l4.2-4.2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
    </g>
    <style>{`
      @keyframes sparkle-fade {
        0% { opacity: 1; transform: scale(0.7); }
        60% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(0.5); }
      }
    `}</style>
  </svg>
);

export default Sparkle;
