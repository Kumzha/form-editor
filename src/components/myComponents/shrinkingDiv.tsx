import { useState, useEffect } from "react";

export default function ShrinkingDiv() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate the height based on scroll position
  const maxHeight = 64; // h-16 in pixels
  const newHeight = Math.max(0, maxHeight - scrollY);

  return (
    <div className="bg-transparent" style={{ height: `${newHeight}px` }} />
  );
}
