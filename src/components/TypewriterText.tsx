import React, { useEffect, useState } from "react";

interface TypewriterTextProps {
  children: string;
  className?: string;
  speed?: number; // ms per character
}

export default function TypewriterText({ children, className = "", speed = 45 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    let timeout: NodeJS.Timeout;
    function type() {
      setDisplayed(children.slice(0, i + 1));
      if (i < children.length - 1) {
        i++;
        timeout = setTimeout(type, speed);
      }
    }
    setDisplayed("");
    i = 0;
    timeout = setTimeout(type, speed);
    return () => clearTimeout(timeout);
  }, [children, speed]);

  return <p className={className}>{displayed}<span className="typewriter-cursor">|</span></p>;
}