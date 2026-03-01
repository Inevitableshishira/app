import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── LIGHTBOX ─────────────────────────────────────────────── */
const Lightbox = ({ project, onClose }) => {
  const allImages = [project.image, ...(project.images || [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  // mount animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 380);
  }, [onClose]);

  // keyboard nav
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setActive(a => (a + 1) % allImages.length);
      if (e.key === "ArrowLeft") setActive(a => (a - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [close, allImages.length]);

  const changeImage = (idx) => {
    setImgLoaded(false);
    setActive(idx);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1)",
        padding: "24px",
      }}
    >
      {/* CLOSE */}
      <button
        onClick={close}
        style={{
          position: "absolute", top: 24, right: 28,
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.5)", fontSize: 28, lineHeight: 1,
          transition: "color 0.2s", zIndex: 10,
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#fff"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
      >
        ✕
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: allImages.length > 1 ? "1fr 360px" : "1fr",
          gap: 0,
          width: "100%",
          maxWidth: 1100,
          maxHeight: "88vh",
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        {/* MAIN IMAGE */}
        <div style={{ position: "relative", background: "#111", overflow: "hidden" }}>
          {/* prev / next arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => changeImage((active - 1 + allImages.length) % allImages.length)}
                style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  zIndex: 5, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", width: 40, height: 40, cursor: "pointer", fontSize: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.8)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
              >‹</button>
              <button
                onClick={() => changeImage((active + 1) % allImages.length)}
                style={{
                  position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                  zIndex: 5, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", width: 40, height: 40, cursor: "pointer", fontSize: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.8)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
              >›</button>
            </>
          )}

          {/* image counter */}
          {allImages.length > 1 && (
            <div style={{
              position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 6, zIndex: 5,
            }}>
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeImage(i)}
                  style={{
                    width: i === active ? 20 : 6, height: 6,
                    borderRadius: 3, border: "none",
                    background: i === active ? "#fff" : "rgba(255,255,255,0.35)",
                    cursor: "pointer", padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}

          <img
            key={active}
            src={allImages[active]}
            alt={project.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", height: "100%",
              maxHeight: "88vh",
              objectFit: "cover",
              display: "block",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
              filter: "grayscale(20%)",
            }}
          />
        </div>

        {/* DETAIL PANEL */}
        <div style={{
          background: "#fff",
          padding: "48px 36px",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
        }}>
          <div>
            {/* meta */}
            <p style={{
              fontSize: 9, textTransform: "uppercase", letterSpacing: "0.35em",
              color: "rgba(0,0,0,0.3)", marginBottom: 16,
            }}>
              {project.location} — {project.year}
            </p>

            {/* title */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.15,
              marginBottom: 24, color: "#111",
            }}>
              {project.title}
            </h2>

            {/* divider */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", marginBottom: 24 }} />

            {/* description */}
            <p style={{
              fontSize: 14, color: "rgba(0,0,0,0.6)",
              lineHeight: 1.8, fontWeight: 300, marginBottom: 32,
            }}>
              {project.description}
            </p>

            {/* category badge */}
            <span style={{
              fontSize: 8, border: "1px solid rgba(0,0,0,0.12)",
              padding: "5px 12px", textTransform: "uppercase",
              letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)",
            }}>
              {project.category}
            </span>
          </div>

          {/* thumbnail strip */}
          {allImages.length > 1 && (
            <div style={{ marginTop: 32 }}>
              <p style={{
                fontSize: 8, textTransform: "uppercase", letterSpacing: "0.3em",
                color: "rgba(0,0,0,0.25)", marginBottom: 12,
              }}>
                {allImages.length} Images
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => changeImage(i)}
                    style={{
                      width: 56, height: 40, padding: 0, border: "none",
                      cursor: "pointer", overflow: "hidden",
                      outline: i === active ? "2px solid #111" : "2px solid transparent",
                      outlineOffset: 2,
                      transition: "outline 0.2s",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        filter: i === active ? "none" : "grayscale(60%)",
                        transition: "filter 0.3s",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 32 }}>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 24 }}>
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 14, letterSpacing: "0.05em" }}>
                Interested in a similar project?
              </p>
              <a
                href="#contact"
                onClick={close}
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  background: "#111", color: "#fff",
                  fontSize: 10, textTransform: "uppercase",
                  letterSpacing: "0.3em", textDecoration: "none",
                  fontFamily: "Inter, sans-serif", fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#333"}
                onMouseLeave={e => e.currentTarget.style.background = "#111"}
              >
                Inquire Now
              </a>
            </div>
          </div>
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
