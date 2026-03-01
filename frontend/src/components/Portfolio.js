import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── LIGHTBOX ─────────────────────────────────────────────── */
const Lightbox = ({ project, onClose }) => {
  const allImages = [project.image, ...(project.images || [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = React.useRef(null);
  const trackRef = React.useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 350);
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

  const goTo = (idx) => {
    setDragOffset(0);
    setActive(idx);
  };

  // Touch / mouse drag
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

  const translateX = -active * 100 + (dragOffset / (trackRef.current?.offsetWidth || window.innerWidth)) * 100;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      {/* ── TOP BAR ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        zIndex: 10, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
      }}>
        {/* Back */}
        <button onClick={close} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#fff",
          cursor: "pointer", fontSize: 13, letterSpacing: "0.15em",
          textTransform: "uppercase", fontFamily: "Inter, sans-serif",
          opacity: 0.85,
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>←</span> Back
        </button>

        {/* Counter */}
        {allImages.length > 1 && (
          <span style={{
            fontSize: 11, color: "rgba(255,255,255,0.6)",
            fontFamily: "Inter, sans-serif", letterSpacing: "0.2em",
          }}>
            {active + 1} / {allImages.length}
          </span>
        )}
      </div>

      {/* ── SWIPE TRACK ── */}
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={(e) => dragging && onTouchMove(e)}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
        style={{
          position: "absolute", inset: 0,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        <div style={{
          display: "flex",
          width: `${allImages.length * 100}%`,
          height: "100%",
          transform: `translateX(${translateX / allImages.length}%)`,
          transition: dragging ? "none" : "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}>
          {allImages.map((img, i) => (
            <div key={i} style={{
              width: `${100 / allImages.length}%`,
              height: "100%",
              flexShrink: 0,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                src={img}
                alt={`${project.title} ${i + 1}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── DOT INDICATORS ── */}
      {allImages.length > 1 && (
        <div style={{
          position: "absolute", bottom: 180, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", gap: 6, zIndex: 10,
        }}>
          {allImages.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === active ? 22 : 6, height: 6,
              borderRadius: 3, border: "none", padding: 0,
              cursor: "pointer",
              background: i === active ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}

      {/* ── PREV / NEXT — desktop arrows ── */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={() => goTo((active - 1 + allImages.length) % allImages.length)}
            style={{
              position: "absolute", left: 20, top: "50%",
              transform: "translateY(-50%)", zIndex: 10,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", width: 48, height: 48, borderRadius: "50%",
              cursor: "pointer", fontSize: 22,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              opacity: active === 0 ? 0.25 : 1,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >‹</button>
          <button
            onClick={() => goTo((active + 1) % allImages.length)}
            style={{
              position: "absolute", right: 20, top: "50%",
              transform: "translateY(-50%)", zIndex: 10,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", width: 48, height: 48, borderRadius: "50%",
              cursor: "pointer", fontSize: 22,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              opacity: active === allImages.length - 1 ? 0.25 : 1,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >›</button>
        </>
      )}

      {/* ── BOTTOM INFO PANEL ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 10,
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 60%, transparent)",
        padding: "40px 24px 36px",
      }}>
        <p style={{
          fontSize: 9, textTransform: "uppercase",
          letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)",
          marginBottom: 8, fontFamily: "Inter, sans-serif",
        }}>
          {project.location} — {project.year}
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontStyle: "italic",
          fontSize: "clamp(22px, 5vw, 32px)", color: "#fff",
          lineHeight: 1.2, marginBottom: 10,
        }}>
          {project.title}
        </h2>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.55)",
          lineHeight: 1.7, fontFamily: "Inter, sans-serif",
          fontWeight: 300, marginBottom: 20,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {project.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{
            fontSize: 8, border: "1px solid rgba(255,255,255,0.25)",
            padding: "5px 12px", textTransform: "uppercase",
            letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)",
            fontFamily: "Inter, sans-serif",
          }}>
            {project.category}
          </span>
          <a href="#contact" onClick={close} style={{
            padding: "11px 24px", background: "#fff", color: "#111",
            fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em",
            textDecoration: "none", fontFamily: "Inter, sans-serif", fontWeight: 600,
            flexShrink: 0,
          }}>
            Inquire Now
          </a>
        </div>
      </div>
    </div>
  );
};

/* ─── PORTFOLIO ─────────────────────────────────────────────── */
const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const categories = ["All", "Residential", "Commercial"];

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/projects`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filtered = filter === "All"
    ? safeProjects
    : safeProjects.filter(p => p.category === filter);

  return (
    <>
      <section id="portfolio" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-black/5 pb-12 gap-8">
            <div>
              <h2 data-scroll-anchor className="text-5xl md:text-7xl font-serif italic">
                Selected Works
              </h2>
            </div>
            <div className="flex flex-wrap gap-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${
                    filter === cat ? "text-black" : "text-black/30 hover:text-black"
                  }`}
                >
                  {cat}
                  {filter === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* GRID */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-sm text-black/40 uppercase tracking-widest">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-black/40 uppercase tracking-widest">Coming Soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-24">
              {filtered.map((p, i) => (
                <div
                  key={p.id || i}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms`, cursor: "pointer" }}
                  onClick={() => setSelected(p)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* IMAGE */}
                  <div
                    className="relative overflow-hidden aspect-[16/10] bg-stone-100 border border-black/5 mb-8"
                    style={{ transition: "box-shadow 0.4s ease" }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-all duration-700"
                      style={{
                        transform: hoveredId === p.id ? "scale(1.06)" : "scale(1)",
                        filter: hoveredId === p.id ? "grayscale(0%)" : "grayscale(100%)",
                        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1), filter 0.5s ease",
                      }}
                    />

                    {/* hover overlay */}
                    <div
                      style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: hoveredId === p.id ? 1 : 0,
                        transition: "opacity 0.35s ease",
                      }}
                    >
                      <span style={{
                        color: "#fff", fontSize: 10, textTransform: "uppercase",
                        letterSpacing: "0.4em", fontFamily: "Inter, sans-serif",
                        borderBottom: "1px solid rgba(255,255,255,0.6)",
                        paddingBottom: 4,
                        transform: hoveredId === p.id ? "translateY(0)" : "translateY(8px)",
                        transition: "transform 0.35s ease 0.05s",
                      }}>
                        View Project
                      </span>
                    </div>

                    {/* image count badge */}
                    {p.images && p.images.length > 0 && (
                      <span style={{
                        position: "absolute", top: 12, right: 12,
                        background: "rgba(0,0,0,0.6)", color: "#fff",
                        fontSize: 9, padding: "4px 10px",
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        fontFamily: "Inter, sans-serif",
                      }}>
                        {p.images.length + 1} photos
                      </span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-black/30">
                        {p.location} — {p.year}
                      </p>
                      <h3
                        className="text-2xl font-serif italic transition-all duration-300"
                        style={{ color: hoveredId === p.id ? "#000" : "#222" }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-sm text-black/55 mt-2 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                    <span className="text-[8px] border border-black/10 px-3 py-1 uppercase tracking-widest text-black/40 shrink-0 ml-4">
                      {p.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {selected && (
        <Lightbox project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
};

export default Portfolio;
