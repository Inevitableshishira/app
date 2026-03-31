'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * PremiumCursor — Canvas mouse trail
 *
 * 22 fading dot particles trail the cursor with smooth lerp physics.
 * Color auto-detects background luminance under the cursor:
 *   light bg  → black dots
 *   dark bg   → white dots
 * No external deps beyond React. Works in Next.js app router.
 */

const TRAIL_LENGTH = 22;
const DOT_RADIUS   = 3.5;
const FADE_POWER   = 1.8;
const LERP_SPEED   = 0.18;

/* ── Background luminance detection ─────────────────────── */

function parseRGB(color) {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null;
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  return { r: +m[0], g: +m[1], b: +m[2], a: m[3] !== undefined ? +m[3] : 1 };
}

function relativeLuminance({ r, g, b }) {
  const lin = (c) => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function getBgLuminanceAt(x, y) {
  try {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      const bg  = window.getComputedStyle(el).backgroundColor;
      const rgb = parseRGB(bg);
      if (rgb && rgb.a > 0.05) return relativeLuminance(rgb);
    }
  } catch (_) {}
  return 1.0; // fallback: white
}

/* ── Component ───────────────────────────────────────────── */

const CustomCursor = () => {
  const canvasRef  = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(!('ontouchstart' in window) && navigator.maxTouchPoints === 0);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -300, y: -300 };
    const lead  = { x: -300, y: -300 };
    const trail = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -300, y: -300 }));

    let cursorColor   = '#000000';
    let lastSample    = 0;
    const SAMPLE_MS   = 40;

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;
    let raf;
    let prevTime = performance.now();

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - prevTime) / 16.67, 3);
      prevTime = now;

      /* Sample background */
      if (now - lastSample > SAMPLE_MS) {
        lastSample = now;
        const lum = getBgLuminanceAt(mouse.x, mouse.y);
        cursorColor = lum > 0.45 ? '#000000' : '#ffffff';
      }

      /* Physics */
      lead.x = lerp(lead.x, mouse.x, LERP_SPEED * dt);
      lead.y = lerp(lead.y, mouse.y, LERP_SPEED * dt);
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x = lerp(trail[i].x, trail[i - 1].x, 0.35 * dt);
        trail[i].y = lerp(trail[i].y, trail[i - 1].y, 0.35 * dt);
      }
      trail[0].x = lerp(trail[0].x, lead.x, 0.55 * dt);
      trail[0].y = lerp(trail[0].y, lead.y, 0.55 * dt);

      /* Render */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Trail (oldest → newest) */
      for (let i = trail.length - 1; i >= 0; i--) {
        const t      = 1 - i / trail.length;
        const alpha  = Math.pow(t, FADE_POWER) * 0.72;
        const radius = DOT_RADIUS * Math.pow(t, 0.55);
        if (radius < 0.3) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = cursorColor;
        if (i < 5) {
          ctx.shadowColor = cursorColor;
          ctx.shadowBlur  = 5 * t;
        }
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* Sharp lead dot */
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle   = cursorColor;
      ctx.shadowColor = cursorColor;
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      ctx.arc(lead.x, lead.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
};

export default CustomCursor;