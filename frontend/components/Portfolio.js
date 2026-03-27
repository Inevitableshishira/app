'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

let _cache = null;

const toDirectUrl = (url) => {
  if (!url) return url;
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch && url.includes('drive.google.com')) return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  return url;
};

/* ─── LIGHTBOX ─────────────────────────────────────────────── */
const Lightbox = ({ project, onClose }) => {
  const allImages = [project.image, ...(project.images || [])].filter(Boolean).map(toDirectUrl);
  const [active, setActive]         = useState(0);
  const [visible, setVisible]       = useState(false);
  const [dragging, setDragging]     = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [imgLoaded, setImgLoaded]   = useState({});
  const [isMobile, setIsMobile]     = useState(false);
  const touchStartX = useRef(null);
  const trackRef    = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    allImages.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => setImgLoaded(prev => ({ ...prev, [i]: true }));
      img.src = src;
    });
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') goTo((active + 1) % allImages.length);
      if (e.key === 'ArrowLeft')  goTo((active - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [close, active, allImages.length]);

  const goTo = (idx) => { setDragOffset(0); setActive(idx); };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragging(true);
  };
  const onTouchMove = (e) => {
    if (!dragging || touchStartX.current === null) return;
    setDragOffset((e.touches ? e.touches[0].clientX : e.clientX) - touchStartX.current);
  };
  const onTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragOffset < -60 && active < allImages.length - 1) goTo(active + 1);
    else if (dragOffset > 60 && active > 0) goTo(active - 1);
    else setDragOffset(0);
  };

  const trackW     = trackRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1);
  const translateX = -active * 100 + (dragOffset / trackW) * 100;

  /* ── MOBILE ── */
  if (isMobile) return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', opacity:visible?1:0, transition:'opacity 0.28s ease', userSelect:'none', touchAction:'pan-y' }}>
      {/* Top bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to bottom,rgba(0,0,0,0.75),transparent)' }}>
        <button onClick={close} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:'var(--font-inter),Inter,sans-serif' }}>
          <span style={{ fontSize:18 }}>←</span> Back
        </button>
        {allImages.length > 1 && (
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.2em' }}>{active+1} / {allImages.length}</span>
        )}
      </div>

      {/* Swipeable track */}
      <div ref={trackRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ position:'absolute', inset:0, overflow:'hidden', cursor:'grab' }}>
        <div style={{ display:'flex', width:`${allImages.length*100}%`, height:'100%', transform:`translateX(${translateX/allImages.length}%)`, transition:dragging?'none':'transform 0.32s cubic-bezier(0.4,0,0.2,1)', willChange:'transform' }}>
          {allImages.map((img, i) => (
            <div key={i} style={{ width:`${100/allImages.length}%`, height:'100%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={img} alt="" draggable={false} style={{ width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {allImages.length > 1 && (
        <div style={{ position:'absolute', bottom:80, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6, zIndex:10 }}>
          {allImages.map((_,i) => (
            <button key={i} onClick={()=>goTo(i)} style={{ width:i===active?22:6, height:6, borderRadius:3, border:'none', padding:0, cursor:'pointer', background:i===active?'#fff':'rgba(255,255,255,0.35)', transition:'all 0.25s ease' }} />
          ))}
        </div>
      )}

      {/* Bottom — inquire */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, background:'linear-gradient(to top,rgba(0,0,0,0.8) 60%,transparent)', padding:'36px 24px 24px', display:'flex', justifyContent:'flex-end' }}>
        <a href="#contact" onClick={close} style={{ padding:'12px 28px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.3em', textDecoration:'none', fontWeight:600 }}>
          Inquire Now
        </a>
      </div>
    </div>
  );

  /* ── DESKTOP — fullscreen, pure image focus ── */
  return (
    <div onClick={(e)=>e.target===e.currentTarget&&close()}
      style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.94)', display:'flex', alignItems:'center', justifyContent:'center', opacity:visible?1:0, transition:'opacity 0.28s ease' }}>

      {/* Close */}
      <button onClick={close} style={{ position:'absolute', top:24, right:28, background:'none', border:'none', color:'rgba(255,255,255,0.45)', fontSize:26, cursor:'pointer', lineHeight:1, zIndex:10, transition:'color 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>✕</button>

      {/* Counter */}
      {allImages.length > 1 && (
        <div style={{ position:'absolute', top:28, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.35em', textTransform:'uppercase', zIndex:10 }}>
          {active+1} &nbsp;/&nbsp; {allImages.length}
        </div>
      )}

      {/* Prev */}
      {allImages.length > 1 && (
        <button onClick={()=>goTo((active-1+allImages.length)%allImages.length)}
          style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', zIndex:5, background:'none', border:'none', color:active===0?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.55)', cursor:active===0?'default':'pointer', fontSize:44, lineHeight:1, padding:'0 12px', transition:'color 0.2s' }}
          onMouseEnter={e=>{ if(active!==0) e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e=>e.currentTarget.style.color=active===0?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.55)'}>‹</button>
      )}

      {/* Next */}
      {allImages.length > 1 && (
        <button onClick={()=>goTo((active+1)%allImages.length)}
          style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', zIndex:5, background:'none', border:'none', color:active===allImages.length-1?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.55)', cursor:active===allImages.length-1?'default':'pointer', fontSize:44, lineHeight:1, padding:'0 12px', transition:'color 0.2s' }}
          onMouseEnter={e=>{ if(active!==allImages.length-1) e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e=>e.currentTarget.style.color=active===allImages.length-1?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.55)'}>›</button>
      )}

      {/* Image track */}
      <div ref={trackRef}
        onMouseDown={onTouchStart} onMouseMove={(e)=>dragging&&onTouchMove(e)} onMouseUp={onTouchEnd} onMouseLeave={onTouchEnd}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ width:'calc(100% - 120px)', height:'calc(100vh - 110px)', overflow:'hidden', cursor:dragging?'grabbing':'grab', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ display:'flex', width:`${allImages.length*100}%`, height:'100%', transform:`translateX(${translateX/allImages.length}%)`, transition:dragging?'none':'transform 0.32s cubic-bezier(0.4,0,0.2,1)', willChange:'transform' }}>
          {allImages.map((img,i) => (
            <div key={i} style={{ width:`${100/allImages.length}%`, height:'100%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={img} alt="" draggable={false}
                style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', opacity:imgLoaded[i]?1:0, transition:'opacity 0.3s ease', pointerEvents:'none', userSelect:'none' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar — thumbnails + inquire */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, padding:'18px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to top,rgba(0,0,0,0.65),transparent)' }}>
        {allImages.length > 1 ? (
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {allImages.map((img,i) => (
              <button key={i} onClick={()=>goTo(i)}
                style={{ width:52, height:38, padding:0, border:'none', cursor:'pointer', overflow:'hidden', flexShrink:0, outline:i===active?'2px solid #fff':'2px solid transparent', outlineOffset:2, transition:'outline 0.2s,opacity 0.2s', opacity:i===active?1:0.4 }}>
                <img src={img} alt="" draggable={false} style={{ width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none' }} />
              </button>
            ))}
          </div>
        ) : <div />}

        <a href="#contact" onClick={close}
          style={{ padding:'11px 28px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.3em', textDecoration:'none', fontWeight:600, transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.85)'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
          Inquire Now
        </a>
      </div>
    </div>
  );
};

/* ─── SKELETON ──────────────────────────────────────────────── */
const SkeletonCard = ({ wide }) => (
  <div style={{ gridColumn: wide ? 'span 2 / span 2' : undefined, animation:'pulse 1.4s ease-in-out infinite' }}>
    <div style={{ width:'100%', paddingBottom: wide ? '50%' : '75%', background:'#f0f0f0' }} />
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
  </div>
);

/* ─── PORTFOLIO ─────────────────────────────────────────────── */
const Portfolio = () => {
  const [filter, setFilter]         = useState('All');
  const [projects, setProjects]     = useState(_cache || []);
  const [loading, setLoading]       = useState(!_cache);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [hoveredId, setHoveredId]   = useState(null);
  const categories = ['All', 'Residential', 'Commercial'];

  const fetchProjects = useCallback(() => {
    setLoading(true);
    setLoadFailed(false);
    let cancelled = false;
    axios.get(`${API}/projects`, { timeout: 8000 })
      .then(res => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        _cache = data;
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setLoadFailed(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (_cache) { setProjects(_cache); setLoading(false); return; }
    const cancel = fetchProjects();
    return cancel;
  }, [fetchProjects]);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      <section id="portfolio" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 border-b border-black/5 pb-12 gap-8">
            <h2 data-scroll-anchor className="text-5xl md:text-7xl font-serif italic">Selected Works</h2>
            <div className="flex flex-wrap gap-10">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${filter===cat?'text-black':'text-black/30 hover:text-black'}`}>
                  {cat}
                  {filter === cat && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pure photo grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'3px' }}>
            {loading
              ? [0,1,2,3].map(i => <SkeletonCard key={i} wide={i===0} />)
              : loadFailed
                ? (
                  <div style={{ gridColumn:'span 2 / span 2', textAlign:'center', padding:'80px 0' }} className="space-y-6">
                    <p className="text-sm text-black/40 uppercase tracking-widest">Could not load projects.</p>
                    <button onClick={() => { _cache = null; fetchProjects(); }}
                      className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity">
                      Retry
                    </button>
                  </div>
                )
                : filtered.length === 0
                  ? (
                    <div style={{ gridColumn:'span 2 / span 2', textAlign:'center', padding:'80px 0' }}>
                      <p className="text-sm text-black/40 uppercase tracking-widest">Coming Soon...</p>
                    </div>
                  )
                  : filtered.map((p, i) => (
                    <div key={p.id||i}
                      onClick={() => setSelected(p)}
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        gridColumn: i === 0 ? 'span 2 / span 2' : undefined,
                      }}
                    >
                      <div style={{
                        position: 'relative',
                        paddingBottom: i === 0 ? '52%' : '72%',
                        overflow: 'hidden',
                        background: '#f4f4f4',
                      }}>
                        <img
                          src={toDirectUrl(p.image)}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          style={{
                            position:'absolute', inset:0,
                            width:'100%', height:'100%',
                            objectFit:'cover',
                            transform: hoveredId===p.id ? 'scale(1.04)' : 'scale(1)',
                            filter: hoveredId===p.id ? 'grayscale(0%)' : 'grayscale(100%)',
                            transition:'transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.45s ease',
                          }}
                        />

                        {/* Hover overlay */}
                        <div style={{
                          position:'absolute', inset:0,
                          background:'rgba(0,0,0,0.22)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          opacity: hoveredId===p.id ? 1 : 0,
                          transition:'opacity 0.3s ease',
                        }}>
                          <span style={{
                            color:'#fff', fontSize:10,
                            textTransform:'uppercase', letterSpacing:'0.5em',
                            borderBottom:'1px solid rgba(255,255,255,0.7)', paddingBottom:3,
                            transform: hoveredId===p.id ? 'translateY(0)' : 'translateY(8px)',
                            transition:'transform 0.3s ease',
                          }}>View</span>
                        </div>

                        {/* Photo count */}
                        {p.images && p.images.length > 0 && (
                          <span style={{
                            position:'absolute', bottom:12, right:12,
                            background:'rgba(0,0,0,0.48)', color:'#fff',
                            fontSize:9, padding:'4px 10px',
                            letterSpacing:'0.15em', textTransform:'uppercase',
                          }}>
                            {p.images.length + 1} photos
                          </span>
                        )}
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
