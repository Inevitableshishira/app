'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AnimatedText } from './AnimatedText';
import { Magnetic } from './Magnetic';

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
  const [active, setActive]       = useState(0);
  const [visible, setVisible]     = useState(false);
  const [prev, setPrev]           = useState(null);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [isMobile, setIsMobile]   = useState(false);
  const thumbsRef = useRef(null);
  const animTimer = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    allImages.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => setImgLoaded(p => ({ ...p, [i]: true }));
      img.src = src;
    });
    return () => {
      document.body.style.overflow = '';
      clearTimeout(animTimer.current);
    };
  }, [allImages]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 320);
  }, [onClose]);

  const goTo = useCallback((idx) => {
    if (animating || idx === active) return;
    const dir = idx > active ? 1 : -1;
    setDirection(dir);
    setPrev(active);
    setActive(idx);
    setAnimating(true);
    clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => { setPrev(null); setAnimating(false); }, 420);
    setTimeout(() => {
      const el = thumbsRef.current?.querySelector(`[data-idx="${idx}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 50);
  }, [active, animating]);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') goTo(Math.min(active + 1, allImages.length - 1));
      if (e.key === 'ArrowLeft')  goTo(Math.max(active - 1, 0));
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [close, goTo, active, allImages.length]);

  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx < -50) goTo(Math.min(active + 1, allImages.length - 1));
    if (dx >  50) goTo(Math.max(active - 1, 0));
    touchStart.current = null;
  };

  const enterFrom = direction === 1 ? '100%' : '-100%';
  const exitTo    = direction === 1 ? '-100%' : '100%';

  /* ── MOBILE ── */
  if (isMobile) return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', display:'flex', flexDirection:'column', opacity:visible?1:0, transition:'opacity 0.32s ease' }}>
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.6)', flexShrink:0 }}>
        <button onClick={close} style={{ background:'none', border:'none', color:'#fff', cursor:'none', fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>←</span> Close
        </button>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.2em' }}>{active+1} / {allImages.length}</span>
      </div>
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ flex:1, position:'relative', overflow:'hidden' }}>
        {prev !== null && (
          <div key={`out-${prev}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:`translateX(${exitTo})`, transition:`transform 0.4s cubic-bezier(0.4,0,0.2,1)` }}>
            <img src={allImages[prev]} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none', pointerEvents:'none' }} />
          </div>
        )}
        <div key={`in-${active}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:animating?`translateX(${enterFrom})`:'translateX(0)', transition:animating?`transform 0.4s cubic-bezier(0.4,0,0.2,1)`:'none' }}>
          <img src={allImages[active]} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none', pointerEvents:'none', opacity:imgLoaded[active]?1:0, transition:'opacity 0.25s' }} />
        </div>
      </div>
      {allImages.length > 1 && (
        <div ref={thumbsRef} style={{ display:'flex', gap:6, padding:'12px 16px', overflowX:'auto', background:'rgba(0,0,0,0.6)', flexShrink:0, scrollbarWidth:'none' }}>
          {allImages.map((img, i) => (
            <button key={i} data-idx={i} onClick={()=>goTo(i)} style={{ width:52, height:40, flexShrink:0, padding:0, border:'none', cursor:'none', overflow:'hidden', outline:i===active?'2px solid #fff':'2px solid transparent', outlineOffset:2, opacity:i===active?1:0.4, transition:'all 0.28s ease' }}>
              <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none', display:'block' }} />
            </button>
          ))}
        </div>
      )}
      <div style={{ padding:'14px 20px', display:'flex', justifyContent:'flex-end', background:'rgba(0,0,0,0.6)', flexShrink:0 }}>
        <a href="#contact" onClick={close} style={{ padding:'11px 28px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.35em', textDecoration:'none', fontWeight:700 }}>Inquire Now</a>
      </div>
    </div>
  );

  /* ── DESKTOP ── */
  const THUMB_H   = allImages.length > 1 ? 100 : 0;
  const THUMB_GAP = allImages.length > 1 ? 16 : 0;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      style={{ position:'fixed', inset:0, zIndex:9999, background:visible?'rgba(0,0,0,0.96)':'rgba(0,0,0,0)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transition:'background 0.36s ease', padding:'60px 70px 24px' }}
    >
      {/* Close */}
      <Magnetic strength={0.4}>
        <button
          onClick={close}
          style={{ position:'absolute', top:22, right:28, background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:22, cursor:'none', zIndex:10, fontFamily:'inherit', transition:'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color='#fff'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}
        >✕</button>
      </Magnetic>

      {/* Counter */}
      <div style={{ position:'absolute', top:26, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.4em', textTransform:'uppercase', fontFamily:'inherit', opacity:visible?1:0, transition:'opacity 0.4s 0.1s' }}>
        {active+1} &nbsp;/&nbsp; {allImages.length}
      </div>

      {/* Main image area */}
      <div style={{ flex:1, width:'100%', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', minHeight:0 }}>

        {/* Left arrow */}
        <Magnetic strength={0.25}>
          <button
            onClick={() => goTo(Math.max(active-1, 0))}
            disabled={active === 0}
            style={{ zIndex:5, background:'none', border:'none', color:active===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)', cursor:'none', fontSize:52, lineHeight:1, padding:'40px 24px', fontFamily:'inherit', transition:'color 0.2s, transform 0.15s' }}
            onMouseEnter={e => { if (active!==0) { e.currentTarget.style.color='#fff'; } }}
            onMouseLeave={e => { e.currentTarget.style.color=active===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)'; }}
          >‹</button>
        </Magnetic>

        {/* Image stage */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          style={{ width:'calc(100% - 200px)', height:'100%', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {prev !== null && (
            <div key={`out-${prev}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:`translateX(${exitTo})`, transition:'transform 0.42s cubic-bezier(0.4,0,0.2,1)', pointerEvents:'none' }}>
              <img src={allImages[prev]} alt="" draggable={false} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none' }} />
            </div>
          )}
          <div key={`in-${active}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:animating?`translateX(${enterFrom})`:'translateX(0)', transition:animating?'transform 0.42s cubic-bezier(0.4,0,0.2,1)':'none' }}>
            {!imgLoaded[active] && (
              <div style={{ width:'60%', height:'60%', background:'linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s ease-in-out infinite' }} />
            )}
            <img src={allImages[active]} alt="" draggable={false}
              style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none', pointerEvents:'none', opacity:imgLoaded[active]?1:0, transition:'opacity 0.3s ease', position:imgLoaded[active]?'relative':'absolute' }} />
          </div>
        </div>

        {/* Right arrow */}
        <Magnetic strength={0.25}>
          <button
            onClick={() => goTo(Math.min(active+1, allImages.length-1))}
            disabled={active === allImages.length-1}
            style={{ zIndex:5, background:'none', border:'none', color:active===allImages.length-1?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)', cursor:'none', fontSize:52, lineHeight:1, padding:'40px 24px', fontFamily:'inherit', transition:'color 0.2s, transform 0.15s' }}
            onMouseEnter={e => { if (active!==allImages.length-1) { e.currentTarget.style.color='#fff'; } }}
            onMouseLeave={e => { e.currentTarget.style.color=active===allImages.length-1?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)'; }}
          >›</button>
        </Magnetic>
      </div>

      {/* Thumbnails row */}
      {allImages.length > 1 && (
        <div style={{ width:'100%', marginTop:THUMB_GAP, flexShrink:0 }}>
          <div ref={thumbsRef} style={{ display:'flex', gap:10, justifyContent:'center', overflowX:'auto', paddingBottom:12, scrollbarWidth:'none' }}>
            {allImages.map((img, i) => (
              <Magnetic key={i} strength={0.15}>
                <button
                  data-idx={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i===active ? 90 : 72,
                    height: THUMB_H,
                    flexShrink:0, padding:0, border:'none', cursor:'none', overflow:'hidden',
                    outline: i===active ? '1px solid #fff' : '1px solid transparent',
                    outlineOffset:4,
                    opacity: i===active ? 1 : 0.3,
                    transform: i===active ? 'scale(1.05)' : 'scale(1)',
                    transition:'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    position:'relative',
                  }}
                >
                  <img src={img} alt="" draggable={false}
                    style={{ width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none', display:'block', filter:i===active?'none':'grayscale(100%)', transition:'filter 0.4s ease' }} />
                </button>
              </Magnetic>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ display:'flex', justifyContent:'flex-end', width:'100%', marginTop:24, flexShrink:0 }}>
        <Magnetic strength={0.3}>
          <a
            href="#contact"
            onClick={close}
            style={{ padding:'14px 44px', background:'#fff', color:'#111', fontSize:10, textTransform:'uppercase', letterSpacing:'0.45em', textDecoration:'none', fontWeight:700, transition:'background 0.3s, transform 0.2s', display:'inline-block' }}
          >Inquire Now</a>
        </Magnetic>
      </div>

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
};

/* ─── PROJECT CARD ──────────────────────────────────────────── */
const ProjectCard = ({ project, index, onOpen }) => {
  const [hovered, setHovered]   = useState(false);
  const [mousePos, setMousePos] = useState({ x:0.5, y:0.5 });
  const cardRef  = useRef(null);
  const isWide   = index === 0;
  const allCount = 1 + (project.images?.length || 0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x:(e.clientX-rect.left)/rect.width, y:(e.clientY-rect.top)/rect.height });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      ref={cardRef}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({x:0.5,y:0.5}); }}
      onMouseMove={handleMouseMove}
      className="relative cursor-none overflow-hidden bg-[#f8f8f8]"
      style={{ gridColumn: isWide ? 'span 2/span 2' : undefined }}
    >
      <div className="relative overflow-hidden" style={{ paddingBottom:isWide?'52%':'75%' }}>
        <Image
          src={toDirectUrl(project.image)}
          alt={project.title||''}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{
            filter: hovered ? 'grayscale(0%) brightness(0.9)' : 'grayscale(100%) brightness(1)',
            transform: hovered ? `scale(1.1) translate(${(mousePos.x-0.5)*-15}px,${(mousePos.y-0.5)*-15}px)` : 'scale(1) translate(0,0)',
          }}
        />
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-12 transition-all duration-700 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4 text-center">
            <h3 className="text-white text-3xl font-serif italic tracking-tight">{project.title}</h3>
            <p className="text-white/60 text-[10px] uppercase tracking-[0.4em]">{project.category}</p>
          </div>
          <span data-magnetic className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold">View Story</span>
        </div>

        <div className="absolute bottom-10 left-10 text-white z-10 transition-all duration-700 pointer-events-none" style={{ opacity: hovered ? 0 : 1 }}>
          <p className="text-[9px] uppercase tracking-[0.5em] opacity-40 mb-2">{project.category}</p>
          <h4 className="text-2xl font-serif italic">{project.title}</h4>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── SHIMMER SKELETON ── */
const SkeletonCard = ({ wide }) => (
  <div style={{ gridColumn:wide?'span 2/span 2':undefined }}>
    <div style={{ width:'100%', paddingBottom:wide?'52%':'72%', background:'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s ease-in-out infinite' }} />
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

/* ─── PORTFOLIO SECTION ── */
const Portfolio = () => {
  const [filter, setFilter]         = useState('All');
  const [projects, setProjects]     = useState(_cache || []);
  const [loading, setLoading]       = useState(!_cache);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected]     = useState(null);
  const categories = ['All', 'Residential', 'Commercial'];

  const fetchProjects = useCallback(() => {
    setLoading(true); setLoadFailed(false);
    let cancelled = false;
    axios.get(`${API}/projects`, { timeout:8000 })
      .then(res => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        _cache = data; setProjects(data); setLoading(false);
      })
      .catch(() => { if (cancelled) return; setLoading(false); setLoadFailed(true); });
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
      <section id="portfolio" className="py-48 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 md:px-16 w-full">
          <div className="flex flex-col items-center mb-40 text-center">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-[10px] uppercase tracking-[0.6em] text-black/30 font-medium block mb-8"
            >
              Selected Portfolio
            </motion.span>
            <AnimatedText 
              text="Curated Architectural Works"
              className="text-6xl md:text-8xl lg:text-9xl font-serif italic leading-tight"
              delay={0.2}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-24">
            {categories.map(cat => (
                <Magnetic key={cat} strength={0.2}>
                  <button
                    data-magnetic
                    onClick={() => setFilter(cat)}
                    className={`text-[10px] uppercase tracking-[0.4em] transition-all relative px-6 py-2 rounded-full border ${filter===cat?'text-black border-black/10 bg-black/[0.03]':'text-black/30 border-transparent hover:text-black'}`}
                  >
                    {cat}
                  </button>
                </Magnetic>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
            {loading
              ? [0,1,2,3].map(i => <SkeletonCard key={i} wide={i===0} />)
              : loadFailed
                ? (
                  <div className="col-span-1 md:col-span-2 py-40 flex flex-col items-center gap-8">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black/40">Network connection refused</p>
                    <button onClick={() => { _cache=null; fetchProjects(); }} className="px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-medium">Attempt Reconnect</button>
                  </div>
                )
                : filtered.length === 0
                  ? (
                    <div className="col-span-1 md:col-span-2 py-40 text-center">
                      <p className="text-[10px] uppercase tracking-[0.6em] text-black/20 italic">No works found in this Category</p>
                    </div>
                  )
                  : filtered.map((p, i) => (
                    <ProjectCard key={p.id||i} project={p} index={i} onOpen={() => setSelected(p)} />
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