import React from "react";

interface PaperAirplaneProgressProps {
  current: number;
  total: number;
}

// Simple paper airplane SVG
const PaperAirplaneSVG = () => (
  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="0,16 48,0 40,32 24,20 0,16" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
    <polyline points="0,16 24,20 40,32" fill="none" stroke="#2563eb" strokeWidth="2" />
  </svg>
);

const PaperAirplaneProgress: React.FC<PaperAirplaneProgressProps> = ({ current, total }) => {
  // Calculate progress as a percentage (0 to 1)
  const progress = total <= 1 ? 0 : current / (total - 1);
  return (
    <div className="fixed left-0 top-0 w-full h-16 z-40 pointer-events-none">
      <div className="relative w-full h-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-transform duration-700"
          style={{
            left: `calc(${progress * 100}% - 24px)`, // 24px is half the SVG width
          }}
        >
          <PaperAirplaneSVG />
        </div>
        {/* Optional: Progress bar background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-blue-200/30 dark:bg-blue-900/30 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full transition-all duration-700"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PaperAirplaneProgress;
