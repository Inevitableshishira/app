'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Premium custom cursor
 * — Outer ring: large, slow-following halo
 * — Inner dot: sharp, near-instant tracking
 * — Hover state: ring expands + blends into element, dot hides
 * — Click state: quick scale-down pulse
 * — Text state: transforms into an I-beam / thin vertical line
 * — Link/button: "VIEW" label fades in inside the ring
 */
const CustomCursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const labelRef = useRef(null);

  const pos       = useRef({ x: -100, y: -100 });
  const outerPos  = useRef({ x: -100, y: -100 });
  const raf       = useRef(null);

  const [isDesktop, setIsDesktop]   = useState(false);
  const [cursorState, setCursorState] = useState('default'); // default | hover | text | click

  useEffect(() => {
    const desktop = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
    setIsDesktop(desktop);
  }, []);

  const lerp = (a, b, t) => a + (b - a) * t;

  const loop = useCallback(() => {
    if (!outerRef.current || !innerRef.current) { raf.current = requestAnimationFrame(loop); return; }

    outerPos.current.x = lerp(outerPos.current.x, pos.current.x, 0.12);
    outerPos.current.y = lerp(outerPos.current.y, pos.current.y, 0.12);

    outerRef.current.style.transform =
      `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0)`;
    innerRef.current.style.transform =
      `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;

    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => {
      setCursorState('click');
      setTimeout(() => setCursorState(prev => prev === 'click' ? 'default' : prev), 220);
    };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor="hover"]');
      const txt = e.target.closest('input, textarea, [contenteditable]');
      if (txt) { setCursorState('text'); return; }
      if (el) { setCursorState('hover'); return; }
      setCursorState('default');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseover', onOver);

    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [isDesktop, loop]);

  if (!isDesktop) return null;

  const isHover  = cursorState === 'hover';
  const isText   = cursorState === 'text';
  const isClick  = cursorState === 'click';

  return (
    <>
      {/* OUTER RING — slow lag */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width:  isHover ? 64 : isText ? 2 : 36,
          height: isHover ? 64 : isText ? 32 : 36,
          borderRadius: isText ? '1px' : '50%',
          border: isText
            ? '1.5px solid rgba(0,0,0,0.9)'
            : isHover
              ? '1px solid rgba(0,0,0,0.15)'
              : '1px solid rgba(0,0,0,0.6)',
          background: isHover
            ? 'rgba(0,0,0,0.06)'
            : isText
              ? 'rgba(0,0,0,0.9)'
              : 'transparent',
          backdropFilter: isHover ? 'blur(6px)' : 'none',
          pointerEvents: 'none',
          zIndex: 99998,
          marginLeft: isHover ? -32 : isText ? -1 : -18,
          marginTop:  isHover ? -32 : isText ? -16 : -18,
          transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1), border-radius 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, border 0.35s ease, margin 0.35s ease, backdrop-filter 0.35s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Label inside outer ring on hover */}
        <span
          ref={labelRef}
          style={{
            fontSize: 7,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.7)',
            fontFamily: 'inherit',
            opacity: isHover ? 1 : 0,
            transform: isHover ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          VIEW
        </span>
      </div>

      {/* INNER DOT — instant tracking */}
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width:  isText ? 0 : isHover ? 0 : isClick ? 3 : 5,
          height: isText ? 0 : isHover ? 0 : isClick ? 3 : 5,
          borderRadius: '50%',
          background: '#000',
          pointerEvents: 'none',
          zIndex: 99999,
          marginLeft: isHover || isText ? 0 : isClick ? -1.5 : -2.5,
          marginTop:  isHover || isText ? 0 : isClick ? -1.5 : -2.5,
          transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${isClick ? 0.4 : 1})`,
          transition: 'width 0.2s ease, height 0.2s ease, transform 0.15s ease, opacity 0.2s ease, margin 0.2s ease',
          opacity: isText || isHover ? 0 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
