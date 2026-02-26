import React, { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] 
                 bg-black/10 backdrop-blur-sm border border-black/20 
                 transition-transform duration-75"
      style={{
        transform: `translate(${position.x - 20}px, ${position.y - 20}px)`
      }}
    />
  );
};

export default CustomCursor;
