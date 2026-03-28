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

/* ─── LIGHTBOX ──────────────────────────────────────────────── */
const Lightbox = ({ project, onClose }) => {
  const allImages = [project.image, ...(project.images || [])].filter(Boolean).map(toDirectUrl);
  const [active, setActive]               = useState(0);
  const [visible, setVisible]             = useState(false);
  const [dragging, setDragging]           = useState(false);
  const [dragOffset, setDragOffset]       = useState(0);
  const [imgLoaded, setImgLoaded]         = useState({});
  const [isMobile, setIsMobile]           = useState(false);
  const [thumbsVisible, setThumbsVisible] = useState(false);
  const touchStartX = useRef(null);
  const trackRef    = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    requestAnimationFrame(() => {
      setVisible(true);
      setTimeout(() => setThumbsVisible(true), 200);
    });
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
    setThumbsVisible(false);
    setTimeout(onClose, 320);
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
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', opacity:visible?1:0, transition:'opacity 0.32s cubic-bezier(0.4,0,0.2,1)', userSelect:'none', touchAction:'pan-y' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)' }}>
        <button onClick={close} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', fontFamily:'inherit' }}>
          <span style={{ fontSize:20 }}>←</span> Close
        </button>
        {allImages.length > 1 && <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.2em' }}>{active+1} / {allImages.length}</span>}
      </div>
      <div ref={trackRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ position:'absolute', inset:0, overflow:'hidden' }}>
        <div style={{ display:'flex', width:`${allImages.length*100}%`, height:'100%', transform:`translateX(${translateX/allImages.length}%)`, transition:dragging?'none':'transform 0.36s cubic-bezier(0.4,0,0.2,1)', willChange:'transform' }}>
          {allImages.map((img, i) => (
            <div key={i} style={{ width:`${100/allImages.length}%`, height:'100%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={img} alt="" draggable={false} style={{ width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none', opacity:imgLoaded[i]?1:0, transition:'opacity 0.3s' }} />
            </div>
          ))}
        </div>
      </div>
      {allImages.length > 1 && (
        <div style={{ position:'absolute', bottom:80, left:'50%', transform:'translateX(-50%)', display:'flex', gap:7, zIndex:10 }}>
          {allImages.map((_,i) => <button key={i} onClick={()=>goTo(i)} style={{ width:i===active?24:6, height:6, borderRadius:3, border:'none', padding:0, cursor:'pointer', background:i===active?'#fff':'rgba(255,255,255,0.3)', transition:'all 0.28s cubic-bezier(0.4,0,0.2,1)' }} />)}
        </div>
      )}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, background:'linear-gradient(to top,rgba(0,0,0,0.85) 60%,transparent)', padding:'36px 24px 24px', display:'flex', justifyContent:'flex-end' }}>
        <a href="#contact" onClick={close} style={{ padding:'12px 28px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.35em', textDecoration:'none', fontWeight:700 }}>Inquire Now</a>
      </div>
    </div>
  );

  /* ── DESKTOP — immersive fullscreen ── */
  return (
    <div onClick={(e)=>e.target===e.currentTarget&&close()} style={{ position:'fixed', inset:0, zIndex:9999, background:visible?'rgba(0,0,0,0.96)':'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.36s cubic-bezier(0.4,0,0.2,1)' }}>

      {/* Close */}
      <button onClick={close} style={{ position:'absolute', top:24, right:28, background:'none', border:'none', color:visible?'rgba(255,255,255,0.5)':'transparent', fontSize:22, cursor:'pointer', lineHeight:1, zIndex:10, transition:'color 0.2s', fontFamily:'inherit' }}
        onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>✕</button>

      {/* Counter */}
      {allImages.length > 1 && (
        <div style={{ position:'absolute', top:28, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.4em', textTransform:'uppercase', zIndex:10, opacity:visible?1:0, transition:'opacity 0.4s 0.1s', fontFamily:'inherit' }}>
          {active+1} &nbsp;/&nbsp; {allImages.length}
        </div>
      )}

      {/* Arrows */}
      {allImages.length > 1 && (
        <>
          <button onClick={()=>goTo((active-1+allImages.length)%allImages.length)} disabled={active===0}
            style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', zIndex:5, background:'none', border:'none', color:active===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)', cursor:active===0?'default':'pointer', fontSize:48, lineHeight:1, padding:'0 14px', transition:'color 0.2s, transform 0.15s', fontFamily:'inherit' }}
            onMouseEnter={e=>{ if(active!==0){e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(-50%) translateX(-3px)';}}}
            onMouseLeave={e=>{ e.currentTarget.style.color=active===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)';e.currentTarget.style.transform='translateY(-50%)'; }}>‹</button>
          <button onClick={()=>goTo((active+1)%allImages.length)} disabled={active===allImages.length-1}
            style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', zIndex:5, background:'none', border:'none', color:active===allImages.length-1?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)', cursor:active===allImages.length-1?'default':'pointer', fontSize:48, lineHeight:1, padding:'0 14px', transition:'color 0.2s, transform 0.15s', fontFamily:'inherit' }}
            onMouseEnter={e=>{ if(active!==allImages.length-1){e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(-50%) translateX(3px)';}}}
            onMouseLeave={e=>{ e.currentTarget.style.color=active===allImages.length-1?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)';e.currentTarget.style.transform='translateY(-50%)'; }}>›</button>
        </>
      )}

      {/* Main image track */}
      <div ref={trackRef}
        onMouseDown={onTouchStart} onMouseMove={(e)=>dragging&&onTouchMove(e)} onMouseUp={onTouchEnd} onMouseLeave={onTouchEnd}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ width:'calc(100% - 130px)', height:'calc(100vh - 130px)', overflow:'hidden', cursor:dragging?'grabbing':'grab', display:'flex', alignItems:'center', justifyContent:'center', opacity:visible?1:0, transform:visible?'scale(1)':'scale(0.95)', transition:'opacity 0.36s cubic-bezier(0.4,0,0.2,1), transform 0.36s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ display:'flex', width:`${allImages.length*100}%`, height:'100%', transform:`translateX(${translateX/allImages.length}%)`, transition:dragging?'none':'transform 0.36s cubic-bezier(0.4,0,0.2,1)', willChange:'transform' }}>
          {allImages.map((img, i) => (
            <div key={i} style={{ width:`${100/allImages.length}%`, height:'100%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={img} alt="" draggable={false} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', pointerEvents:'none', userSelect:'none', opacity:imgLoaded[i]?1:0, transition:'opacity 0.4s ease' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to top,rgba(0,0,0,0.7) 60%,transparent)', opacity:thumbsVisible?1:0, transform:thumbsVisible?'translateY(0)':'translateY(12px)', transition:'opacity 0.4s 0.15s, transform 0.4s 0.15s' }}>
        {allImages.length > 1 ? (
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            {allImages.map((img, i) => (
              <button key={i} onClick={()=>goTo(i)} style={{ width:i===active?64:48, height:44, padding:0, border:'none', cursor:'pointer', overflow:'hidden', flexShrink:0, outline:i===active?'1.5px solid rgba(255,255,255,0.9)':'1.5px solid transparent', outlineOffset:2, opacity:i===active?1:0.38, transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
                <img src={img} alt="" draggable={false} style={{ width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none', display:'block' }} />
              </button>
            ))}
          </div>
        ) : <div />}
        <a href="#contact" onClick={close} style={{ padding:'12px 32px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.4em', textDecoration:'none', fontWeight:700, flexShrink:0, transition:'background 0.2s, transform 0.15s', display:'inline-block' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.88)';e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='#fff';e.currentTarget.style.transform='translateY(0)'; }}>
          Inquire Now
        </a>
      </div>
    </div>
  );
};

/* ─── ANIMATED PROJECT CARD ─────────────────────────────────── */
const ProjectCard = ({ project, index, onOpen }) => {
  const [hovered, setHovered]   = useState(false);
  const [entered, setEntered]   = useState(false);
  const [mousePos, setMousePos] = useState({ x:0.5, y:0.5 });
  const cardRef = useRef(null);
  const isWide  = index === 0;
  const allCount = 1 + (project.images?.length || 0);

  /* staggered entrance animation */
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), index * 80 + 60);
    return () => clearTimeout(t);
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x:0.5, y:0.5 }); }}
      onMouseMove={handleMouseMove}
      style={{
        gridColumn: isWide ? 'span 2 / span 2' : undefined,
        position:'relative',
        cursor:'pointer',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(28px)',
        transition:`opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${index*70}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${index*70}ms`,
      }}
    >
      {/* Image wrapper */}
      <div style={{ position:'relative', paddingBottom: isWide?'52%':'72%', overflow:'hidden', background:'#f0f0f0' }}>

        {/* Main image — parallax + colour reveal on hover */}
        <img
          src={toDirectUrl(project.image)}
          alt={project.title || ''}
          loading="lazy"
          decoding="async"
          style={{
            position:'absolute', inset:0,
            width:'100%', height:'100%',
            objectFit:'cover',
            filter: hovered ? 'grayscale(0%) brightness(0.8)' : 'grayscale(100%) brightness(1.0)',
            transform: hovered
              ? `scale(1.07) translate(${(mousePos.x-0.5)*-10}px,${(mousePos.y-0.5)*-10}px)`
              : 'scale(1) translate(0,0)',
            transition:'filter 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        {/* Directional vignette — follows mouse */}
        <div style={{
          position:'absolute', inset:0,
          background: hovered
            ? `radial-gradient(ellipse at ${mousePos.x*100}% ${mousePos.y*100}%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.54) 100%)`
            : 'linear-gradient(to top,rgba(0,0,0,0.14),transparent 55%)',
          transition:'background 0.5s ease',
          pointerEvents:'none',
        }} />

        {/* "View Project" label — rises from centre */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:10,
          opacity: hovered ? 1 : 0,
          transition:'opacity 0.3s ease',
          pointerEvents:'none',
        }}>
          <span style={{
            fontSize:11, textTransform:'uppercase', letterSpacing:'0.55em',
            color:'#fff', fontWeight:600,
            borderBottom:'1px solid rgba(255,255,255,0.8)', paddingBottom:4,
            fontFamily:'inherit',
            transform: hovered ? 'translateY(0)' : 'translateY(10px)',
            transition:'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
            display:'inline-block',
          }}>View Project</span>
          {allCount > 1 && (
            <span style={{
              fontSize:9, color:'rgba(255,255,255,0.55)',
              letterSpacing:'0.2em', textTransform:'uppercase',
              fontFamily:'inherit',
              transform: hovered ? 'translateY(0)' : 'translateY(10px)',
              transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1) 0.04s',
              display:'inline-block',
            }}>{allCount} photos</span>
          )}
        </div>

        {/* Top-left — category chip (hides on hover) */}
        <div style={{
          position:'absolute', top:14, left:14,
          background:'rgba(0,0,0,0.42)',
          padding:'5px 12px',
          fontSize:8, textTransform:'uppercase', letterSpacing:'0.22em',
          color:'rgba(255,255,255,0.82)',
          fontFamily:'inherit',
          opacity: hovered ? 0 : 1,
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          transition:'opacity 0.22s ease, transform 0.22s ease',
          pointerEvents:'none',
        }}>{project.category}</div>

        {/* Top-right — photo count (hides on hover) */}
        {allCount > 1 && (
          <div style={{
            position:'absolute', top:14, right:14,
            background:'rgba(0,0,0,0.42)',
            padding:'5px 12px',
            fontSize:8, textTransform:'uppercase', letterSpacing:'0.15em',
            color:'rgba(255,255,255,0.7)',
            fontFamily:'inherit',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
            transition:'opacity 0.22s ease 0.03s, transform 0.22s ease 0.03s',
            pointerEvents:'none',
          }}>{allCount} photos</div>
        )}

        {/* Animated border on hover */}
        <div style={{
          position:'absolute', inset:0,
          border: hovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          transition:'border-color 0.4s ease',
          pointerEvents:'none',
        }} />
      </div>
    </div>
  );
};

/* ─── SHIMMER SKELETON ──────────────────────────────────────── */
const SkeletonCard = ({ wide }) => (
  <div style={{ gridColumn: wide ? 'span 2 / span 2' : undefined }}>
    <div style={{
      width:'100%', paddingBottom: wide ? '52%' : '72%',
      background:'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
      backgroundSize:'200% 100%',
      animation:'shimmer 1.5s ease-in-out infinite',
    }} />
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

/* ─── PORTFOLIO SECTION ─────────────────────────────────────── */
const Portfolio = () => {
  const [filter, setFilter]         = useState('All');
  const [projects, setProjects]     = useState(_cache || []);
  const [loading, setLoading]       = useState(!_cache);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected]     = useState(null);
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

          {/* 2-col photo grid with 4px gap */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'4px' }}>
            {loading
              ? [0,1,2,3].map(i => <SkeletonCard key={i} wide={i===0} />)
              : loadFailed
                ? (
                  <div style={{ gridColumn:'span 2/span 2', textAlign:'center', padding:'80px 0' }} className="space-y-6">
                    <p className="text-sm text-black/40 uppercase tracking-widest">Could not load projects.</p>
                    <button onClick={()=>{ _cache=null; fetchProjects(); }}
                      className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity">
                      Retry
                    </button>
                  </div>
                )
                : filtered.length === 0
                  ? (
                    <div style={{ gridColumn:'span 2/span 2', textAlign:'center', padding:'80px 0' }}>
                      <p className="text-sm text-black/40 uppercase tracking-widest">Coming Soon...</p>
                    </div>
                  )
                  : filtered.map((p, i) => (
                    <ProjectCard
                      key={p.id || i}
                      project={p}
                      index={i}
                      onOpen={() => setSelected(p)}
                    />
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
