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
  const [active, setActive]     = useState(0);
  const [visible, setVisible]   = useState(false);
  const [prev, setPrev]         = useState(null);     // index being animated out
  const [direction, setDirection] = useState(1);      // 1 = forward, -1 = backward
  const [animating, setAnimating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [isMobile, setIsMobile] = useState(false);
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
  }, []);

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
    animTimer.current = setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 420);
    // scroll thumb into view
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

  /* touch swipe on main image */
  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx < -50) goTo(Math.min(active + 1, allImages.length - 1));
    if (dx >  50) goTo(Math.max(active - 1, 0));
    touchStart.current = null;
  };

  /* slide animation values */
  const enterFrom = direction === 1 ? '100%' : '-100%';
  const exitTo    = direction === 1 ? '-100%' : '100%';

  /* ── MOBILE ── */
  if (isMobile) return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', display:'flex', flexDirection:'column', opacity:visible?1:0, transition:'opacity 0.32s ease' }}>
      {/* top bar */}
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.6)', flexShrink:0 }}>
        <button onClick={close} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>←</span> Close
        </button>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.2em' }}>{active+1} / {allImages.length}</span>
      </div>

      {/* main image */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ flex:1, position:'relative', overflow:'hidden' }}>
        {/* outgoing */}
        {prev !== null && (
          <div key={`out-${prev}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:`translateX(${exitTo})`, transition:`transform 0.4s cubic-bezier(0.4,0,0.2,1)` }}>
            <img src={allImages[prev]} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none', pointerEvents:'none' }} />
          </div>
        )}
        {/* incoming */}
        <div key={`in-${active}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:animating?`translateX(${enterFrom})`:'translateX(0)', transition:animating?`transform 0.4s cubic-bezier(0.4,0,0.2,1)`:'none', animation:!animating?'none':'unset' }}>
          <img src={allImages[active]} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none', pointerEvents:'none', opacity:imgLoaded[active]?1:0, transition:'opacity 0.25s' }} />
        </div>
      </div>

      {/* thumbs */}
      {allImages.length > 1 && (
        <div ref={thumbsRef} style={{ display:'flex', gap:6, padding:'12px 16px', overflowX:'auto', background:'rgba(0,0,0,0.6)', flexShrink:0, scrollbarWidth:'none' }}>
          {allImages.map((img, i) => (
            <button key={i} data-idx={i} onClick={()=>goTo(i)} style={{ width:52, height:40, flexShrink:0, padding:0, border:'none', cursor:'pointer', overflow:'hidden', outline:i===active?'2px solid #fff':'2px solid transparent', outlineOffset:2, opacity:i===active?1:0.4, transition:'all 0.28s ease' }}>
              <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none', display:'block' }} />
            </button>
          ))}
        </div>
      )}

      {/* bottom */}
      <div style={{ padding:'14px 20px', display:'flex', justifyContent:'flex-end', background:'rgba(0,0,0,0.6)', flexShrink:0 }}>
        <a href="#contact" onClick={close} style={{ padding:'11px 28px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.35em', textDecoration:'none', fontWeight:700 }}>Inquire Now</a>
      </div>
    </div>
  );

  /* ── DESKTOP ── */
  const THUMB_H = allImages.length > 1 ? 100 : 0;
  const THUMB_GAP = allImages.length > 1 ? 16 : 0;

  return (
    <div onClick={(e)=>e.target===e.currentTarget&&close()}
      style={{ position:'fixed', inset:0, zIndex:9999, background:visible?'rgba(0,0,0,0.96)':'rgba(0,0,0,0)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transition:'background 0.36s ease', padding:'60px 70px 24px' }}>

      {/* close */}
      <button onClick={close} style={{ position:'absolute', top:22, right:28, background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:22, cursor:'pointer', zIndex:10, fontFamily:'inherit', transition:'color 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>✕</button>

      {/* counter */}
      <div style={{ position:'absolute', top:26, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.4em', textTransform:'uppercase', fontFamily:'inherit', opacity:visible?1:0, transition:'opacity 0.4s 0.1s' }}>
        {active+1} &nbsp;/&nbsp; {allImages.length}
      </div>

      {/* ── MAIN IMAGE AREA ── */}
      <div style={{ flex:1, width:'100%', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', minHeight:0 }}>

        {/* left arrow */}
        <button onClick={()=>goTo(Math.max(active-1,0))} disabled={active===0}
          style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', zIndex:5, background:'none', border:'none', color:active===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)', cursor:active===0?'default':'pointer', fontSize:52, lineHeight:1, padding:'0 12px', fontFamily:'inherit', transition:'color 0.2s, transform 0.15s' }}
          onMouseEnter={e=>{ if(active!==0){e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-50%) translateX(-3px)'; }}}
          onMouseLeave={e=>{ e.currentTarget.style.color=active===0?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)'; e.currentTarget.style.transform='translateY(-50%)'; }}>‹</button>

        {/* right arrow */}
        <button onClick={()=>goTo(Math.min(active+1,allImages.length-1))} disabled={active===allImages.length-1}
          style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', zIndex:5, background:'none', border:'none', color:active===allImages.length-1?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)', cursor:active===allImages.length-1?'default':'pointer', fontSize:52, lineHeight:1, padding:'0 12px', fontFamily:'inherit', transition:'color 0.2s, transform 0.15s' }}
          onMouseEnter={e=>{ if(active!==allImages.length-1){e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-50%) translateX(3px)'; }}}
          onMouseLeave={e=>{ e.currentTarget.style.color=active===allImages.length-1?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.55)'; e.currentTarget.style.transform='translateY(-50%)'; }}>›</button>

        {/* image stage — slide in/out */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          style={{ width:'calc(100% - 100px)', height:'100%', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>

          {/* outgoing image */}
          {prev !== null && (
            <div key={`out-${prev}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:`translateX(${exitTo})`, transition:'transform 0.42s cubic-bezier(0.4,0,0.2,1)', pointerEvents:'none' }}>
              <img src={allImages[prev]} alt="" draggable={false}
                style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none' }} />
            </div>
          )}

          {/* incoming / current image */}
          <div key={`in-${active}`} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
            transform: animating ? `translateX(${enterFrom})` : 'translateX(0)',
            transition: animating ? 'transform 0.42s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}>
            {/* loading shimmer placeholder */}
            {!imgLoaded[active] && (
              <div style={{ width:'60%', height:'60%', background:'linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s ease-in-out infinite' }} />
            )}
            <img src={allImages[active]} alt="" draggable={false}
              style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', userSelect:'none', pointerEvents:'none', opacity:imgLoaded[active]?1:0, transition:'opacity 0.3s ease', position:imgLoaded[active]?'relative':'absolute' }} />
          </div>
        </div>
      </div>

      {/* ── THUMBNAILS ROW ── */}
      {allImages.length > 1 && (
        <div style={{ width:'100%', marginTop:THUMB_GAP, flexShrink:0 }}>
          {/* scrollable strip */}
          <div ref={thumbsRef} style={{ display:'flex', gap:6, justifyContent:'center', overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
            {allImages.map((img, i) => (
              <button key={i} data-idx={i} onClick={()=>goTo(i)}
                style={{
                  width: i === active ? 80 : 64,
                  height: THUMB_H,
                  flexShrink:0, padding:0, border:'none', cursor:'pointer', overflow:'hidden',
                  outline: i === active ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.1)',
                  outlineOffset: 3,
                  opacity: i === active ? 1 : 0.38,
                  transform: i === active ? 'scale(1.05)' : 'scale(1)',
                  transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  position:'relative',
                }}>
                <img src={img} alt="" draggable={false}
                  style={{ width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none', display:'block',
                    filter: i === active ? 'none' : 'grayscale(60%)',
                    transition:'filter 0.3s ease',
                  }} />
                {/* active indicator line at bottom */}
                {i === active && (
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'#fff' }} />
                )}
              </button>
            ))}
          </div>

          {/* Inquire row */}
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
            <a href="#contact" onClick={close}
              style={{ padding:'11px 32px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.4em', textDecoration:'none', fontWeight:700, transition:'background 0.2s, transform 0.15s', display:'inline-block' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.85)'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='#fff'; e.currentTarget.style.transform='translateY(0)'; }}>
              Inquire Now
            </a>
          </div>
        </div>
      )}

      {/* single image — just inquire */}
      {allImages.length === 1 && (
        <div style={{ display:'flex', justifyContent:'flex-end', width:'100%', marginTop:16, flexShrink:0 }}>
          <a href="#contact" onClick={close}
            style={{ padding:'11px 32px', background:'#fff', color:'#111', fontSize:9, textTransform:'uppercase', letterSpacing:'0.4em', textDecoration:'none', fontWeight:700 }}>
            Inquire Now
          </a>
        </div>
      )}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
};

/* ─── ANIMATED PROJECT CARD ─────────────────────────────────── */
const ProjectCard = ({ project, index, onOpen }) => {
  const [hovered, setHovered]   = useState(false);
  const [entered, setEntered]   = useState(false);
  const [mousePos, setMousePos] = useState({ x:0.5, y:0.5 });
  const cardRef  = useRef(null);
  const isWide   = index === 0;
  const allCount = 1 + (project.images?.length || 0);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), index * 80 + 60);
    return () => clearTimeout(t);
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x:(e.clientX-rect.left)/rect.width, y:(e.clientY-rect.top)/rect.height });
  };

  return (
    <div ref={cardRef} onClick={onOpen}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>{ setHovered(false); setMousePos({x:0.5,y:0.5}); }}
      onMouseMove={handleMouseMove}
      style={{ gridColumn:isWide?'span 2/span 2':undefined, position:'relative', cursor:'pointer', opacity:entered?1:0, transform:entered?'translateY(0)':'translateY(28px)', transition:`opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${index*70}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${index*70}ms` }}>

      <div style={{ position:'relative', paddingBottom:isWide?'52%':'72%', overflow:'hidden', background:'#f0f0f0' }}>
        <img src={toDirectUrl(project.image)} alt={project.title||''} loading="lazy" decoding="async"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
            filter:hovered?'grayscale(0%) brightness(0.8)':'grayscale(100%) brightness(1)',
            transform:hovered?`scale(1.07) translate(${(mousePos.x-0.5)*-10}px,${(mousePos.y-0.5)*-10}px)`:'scale(1) translate(0,0)',
            transition:'filter 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)' }} />

        {/* directional vignette */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background:hovered?`radial-gradient(ellipse at ${mousePos.x*100}% ${mousePos.y*100}%,rgba(255,255,255,0.03) 0%,rgba(0,0,0,0.54) 100%)`:'linear-gradient(to top,rgba(0,0,0,0.14),transparent 55%)',
          transition:'background 0.5s ease' }} />

        {/* centre label */}
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, opacity:hovered?1:0, transition:'opacity 0.3s ease', pointerEvents:'none' }}>
          <span style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.55em', color:'#fff', fontWeight:600, borderBottom:'1px solid rgba(255,255,255,0.8)', paddingBottom:4, fontFamily:'inherit', transform:hovered?'translateY(0)':'translateY(10px)', transition:'transform 0.38s cubic-bezier(0.4,0,0.2,1)', display:'inline-block' }}>View Project</span>
          {allCount > 1 && (
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.55)', letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:'inherit', transform:hovered?'translateY(0)':'translateY(10px)', transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1) 0.04s', display:'inline-block' }}>{allCount} photos</span>
          )}
        </div>

        {/* category chip */}
        <div style={{ position:'absolute', top:14, left:14, background:'rgba(0,0,0,0.42)', padding:'5px 12px', fontSize:8, textTransform:'uppercase', letterSpacing:'0.22em', color:'rgba(255,255,255,0.82)', fontFamily:'inherit', opacity:hovered?0:1, transform:hovered?'translateY(-5px)':'translateY(0)', transition:'opacity 0.22s ease, transform 0.22s ease', pointerEvents:'none' }}>{project.category}</div>

        {/* photo count */}
        {allCount > 1 && (
          <div style={{ position:'absolute', top:14, right:14, background:'rgba(0,0,0,0.42)', padding:'5px 12px', fontSize:8, textTransform:'uppercase', letterSpacing:'0.15em', color:'rgba(255,255,255,0.7)', fontFamily:'inherit', opacity:hovered?0:1, transform:hovered?'translateY(-5px)':'translateY(0)', transition:'opacity 0.22s ease 0.03s, transform 0.22s ease 0.03s', pointerEvents:'none' }}>{allCount} photos</div>
        )}

        {/* animated border */}
        <div style={{ position:'absolute', inset:0, border:hovered?'1px solid rgba(255,255,255,0.2)':'1px solid transparent', transition:'border-color 0.4s ease', pointerEvents:'none' }} />
      </div>
    </div>
  );
};

/* ─── SHIMMER SKELETON ──────────────────────────────────────── */
const SkeletonCard = ({ wide }) => (
  <div style={{ gridColumn:wide?'span 2/span 2':undefined }}>
    <div style={{ width:'100%', paddingBottom:wide?'52%':'72%', background:'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s ease-in-out infinite' }} />
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
      <section id="portfolio" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 border-b border-black/5 pb-12 gap-8">
            <h2 data-scroll-anchor className="text-5xl md:text-7xl font-serif italic">Selected Works</h2>
            <div className="flex flex-wrap gap-10">
              {categories.map(cat => (
                <button key={cat} onClick={()=>setFilter(cat)}
                  className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${filter===cat?'text-black':'text-black/30 hover:text-black'}`}>
                  {cat}
                  {filter===cat && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'4px' }}>
            {loading
              ? [0,1,2,3].map(i=><SkeletonCard key={i} wide={i===0}/>)
              : loadFailed
                ? (
                  <div style={{ gridColumn:'span 2/span 2', textAlign:'center', padding:'80px 0' }} className="space-y-6">
                    <p className="text-sm text-black/40 uppercase tracking-widest">Could not load projects.</p>
                    <button onClick={()=>{ _cache=null; fetchProjects(); }} className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity">Retry</button>
                  </div>
                )
                : filtered.length===0
                  ? (
                    <div style={{ gridColumn:'span 2/span 2', textAlign:'center', padding:'80px 0' }}>
                      <p className="text-sm text-black/40 uppercase tracking-widest">Coming Soon...</p>
                    </div>
                  )
                  : filtered.map((p,i)=>(
                    <ProjectCard key={p.id||i} project={p} index={i} onOpen={()=>setSelected(p)} />
                  ))
            }
          </div>
        </div>
      </section>

      {selected && <Lightbox project={selected} onClose={()=>setSelected(null)} />}
    </>
  );
};

export default Portfolio;
