import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ── Cache so projects never re-fetch after first load ──────────
let _cache = null;

/* ─── LIGHTBOX ─────────────────────────────────────────────── */
const Lightbox = ({ project, onClose }) => {
  const allImages = [project.image, ...(project.images || [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    // Preload all images immediately on open
    allImages.forEach(src => { const img = new Image(); img.src = src; });
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goTo((active + 1) % allImages.length);
      if (e.key === "ArrowLeft") goTo((active - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [close, active, allImages.length]);

  const goTo = (idx) => { setDragOffset(0); setActive(idx); };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragging(true);
  };
  const onTouchMove = (e) => {
    if (!dragging || touchStartX.current === null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setDragOffset(x - touchStartX.current);
  };
  const onTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragOffset < -60 && active < allImages.length - 1) goTo(active + 1);
    else if (dragOffset > 60 && active > 0) goTo(active - 1);
    else setDragOffset(0);
  };

  const trackW = trackRef.current?.offsetWidth || window.innerWidth;
  const translateX = -active * 100 + (dragOffset / trackW) * 100;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.28s ease",
      userSelect: "none", touchAction: "pan-y",
    }}>
      {/* TOP BAR */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
      }}>
        <button onClick={close} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#fff",
          cursor: "pointer", fontSize: 12, letterSpacing: "0.2em",
          textTransform: "uppercase", fontFamily: "Inter, sans-serif", opacity: 0.85,
        }}>
          <span style={{ fontSize: 18 }}>←</span> Back
        </button>
        {allImages.length > 1 && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif", letterSpacing: "0.2em" }}>
            {active + 1} / {allImages.length}
          </span>
        )}
      </div>

      {/* SWIPE TRACK */}
      <div
        ref={trackRef}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart} onMouseMove={(e) => dragging && onTouchMove(e)}
        onMouseUp={onTouchEnd} onMouseLeave={onTouchEnd}
        style={{ position: "absolute", inset: 0, overflow: "hidden", cursor: dragging ? "grabbing" : "grab" }}
      >
        <div style={{
          display: "flex",
          width: `${allImages.length * 100}%`,
          height: "100%",
          transform: `translateX(${translateX / allImages.length}%)`,
          transition: dragging ? "none" : "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}>
          {allImages.map((img, i) => (
            <div key={i} style={{
              width: `${100 / allImages.length}%`, height: "100%",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={img} alt={`${project.title} ${i + 1}`} draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
            </div>
          ))}
        </div>
      </div>

      {/* DOT INDICATORS */}
      {allImages.length > 1 && (
        <div style={{
          position: "absolute", bottom: 180, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 6, zIndex: 10,
        }}>
          {allImages.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === active ? 22 : 6, height: 6, borderRadius: 3,
              border: "none", padding: 0, cursor: "pointer",
              background: i === active ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "all 0.25s ease",
            }} />
          ))}
        </div>
      )}

      {/* ARROWS */}
      {allImages.length > 1 && (
        <>
          <button onClick={() => goTo((active - 1 + allImages.length) % allImages.length)} style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", width: 44, height: 44, borderRadius: "50%",
            cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: active === 0 ? 0.2 : 0.8, transition: "opacity 0.2s",
          }}>‹</button>
          <button onClick={() => goTo((active + 1) % allImages.length)} style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", width: 44, height: 44, borderRadius: "50%",
            cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: active === allImages.length - 1 ? 0.2 : 0.8, transition: "opacity 0.2s",
          }}>›</button>
        </>
      )}

      {/* BOTTOM INFO */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 55%, transparent)",
        padding: "48px 28px 32px",
      }}>
        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>
          {project.location} — {project.year}
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(22px, 4vw, 30px)", color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>
          {project.title}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontFamily: "Inter, sans-serif", fontWeight: 300, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 8, border: "1px solid rgba(255,255,255,0.2)", padding: "5px 12px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", fontFamily: "Inter, sans-serif" }}>
            {project.category}
          </span>
          <a href="#contact" onClick={close} style={{ padding: "12px 28px", background: "#fff", color: "#111", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", textDecoration: "none", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            Inquire Now
          </a>
        </div>
      </div>
    </div>
  );
};

/* ─── SKELETON CARD ─────────────────────────────────────────── */
const SkeletonCard = () => (
  <div style={{ animation: "pulse 1.4s ease-in-out infinite" }}>
    <div style={{ width: "100%", paddingBottom: "62.5%", background: "#f0f0f0", marginBottom: 24 }} />
    <div style={{ height: 10, background: "#f0f0f0", width: "30%", marginBottom: 12 }} />
    <div style={{ height: 20, background: "#f0f0f0", width: "70%", marginBottom: 10 }} />
    <div style={{ height: 14, background: "#f0f0f0", width: "90%" }} />
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
  </div>
);

/* ─── PORTFOLIO ─────────────────────────────────────────────── */
const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState(_cache || []);
  const [loading, setLoading] = useState(!_cache);
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const categories = ["All", "Residential", "Commercial"];

  useEffect(() => {
    if (_cache) return; // already have data, skip fetch
    let cancelled = false;
    axios.get(`${API}/projects`).then(res => {
      if (cancelled) return;
      const data = Array.isArray(res.data) ? res.data : [];
      _cache = data;
      setProjects(data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <>
      <section id="portfolio" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-black/5 pb-12 gap-8">
            <h2 data-scroll-anchor className="text-5xl md:text-7xl font-serif italic">
              Selected Works
            </h2>
            <div className="flex flex-wrap gap-10">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${filter === cat ? "text-black" : "text-black/30 hover:text-black"}`}>
                  {cat}
                  {filter === cat && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-24">
            {loading
              ? [0, 1, 2, 3].map(i => <SkeletonCard key={i} />)
              : filtered.length === 0
                ? <div className="col-span-2 text-center py-20"><p className="text-sm text-black/40 uppercase tracking-widest">Coming Soon...</p></div>
                : filtered.map((p, i) => (
                  <div key={p.id || i} className="group"
                    style={{ cursor: "pointer", animationDelay: `${i * 60}ms` }}
                    onClick={() => setSelected(p)}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* IMAGE */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-stone-100 border border-black/5 mb-8">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          transform: hoveredId === p.id ? "scale(1.05)" : "scale(1)",
                          filter: hoveredId === p.id ? "grayscale(0%)" : "grayscale(100%)",
                          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.45s ease",
                        }}
                      />
                      {/* hover overlay */}
                      <div style={{
                        position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: hoveredId === p.id ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}>
                        <span style={{
                          color: "#fff", fontSize: 10, textTransform: "uppercase",
                          letterSpacing: "0.4em", fontFamily: "Inter, sans-serif",
                          borderBottom: "1px solid rgba(255,255,255,0.6)", paddingBottom: 4,
                          transform: hoveredId === p.id ? "translateY(0)" : "translateY(8px)",
                          transition: "transform 0.3s ease",
                        }}>View Project</span>
                      </div>
                      {/* photo count */}
                      {p.images && p.images.length > 0 && (
                        <span style={{
                          position: "absolute", top: 12, right: 12,
                          background: "rgba(0,0,0,0.55)", color: "#fff",
                          fontSize: 9, padding: "4px 10px",
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          fontFamily: "Inter, sans-serif",
                        }}>{p.images.length + 1} photos</span>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest text-black/30">{p.location} — {p.year}</p>
                        <h3 className="text-2xl font-serif italic" style={{ color: hoveredId === p.id ? "#000" : "#222", transition: "color 0.2s" }}>
                          {p.title}
                        </h3>
                        <p className="text-sm text-black/55 mt-2 leading-relaxed line-clamp-2">{p.description}</p>
                      </div>
                      <span className="text-[8px] border border-black/10 px-3 py-1 uppercase tracking-widest text-black/40 shrink-0 ml-4">
                        {p.category}
                      </span>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {selected && <Lightbox project={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default Portfolio;
