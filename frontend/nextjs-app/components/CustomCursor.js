'use client';
import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(!('ontouchstart' in window) && navigator.maxTouchPoints === 0);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px,${e.clientY - 10}px,0)`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [isDesktop]);

  if (!isDesktop) return null;
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999] bg-black/10 backdrop-blur-sm border border-black/20"
    />
  );
};
export default CustomCursor;
