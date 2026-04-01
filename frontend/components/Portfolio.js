'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AnimatedText } from './AnimatedText';
import { Magnetic } from './Magnetic';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

/* ─── LIGHTBOX ─────────────────────────────────────────────── */
const Lightbox = ({ images, initialIndex, onClose }) => {
  const [active, setActive] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const goTo = (idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors text-3xl font-light z-50"
      >
        ×
      </button>

      <div className="relative w-full max-w-6xl h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => goTo(Math.max(0, active - 1))}
          className={`absolute left-0 z-10 text-white/20 hover:text-white transition-colors text-5xl p-4 ${active === 0 ? 'invisible' : ''}`}
        >
          ‹
        </button>
        <button 
          onClick={() => goTo(Math.min(images.length - 1, active + 1))}
          className={`absolute right-0 z-10 text-white/20 hover:text-white transition-colors text-5xl p-4 ${active === images.length - 1 ? 'invisible' : ''}`}
        >
          ›
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img 
              src={images[active]} 
              alt="" 
              className="max-w-full max-h-full object-contain shadow-2xl"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 text-white/30 text-[10px] uppercase tracking-[0.5em] font-medium">
        {active + 1} / {images.length}
      </div>
    </motion.div>
  );
};

/* ─── PROJECT CARD ──────────────────────────────────────────── */
const ProjectCard = ({ src, index, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x:0.5, y:0.5 });
  const cardRef = useRef(null);
  const isWide = index === 0;

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
      onClick={() => onOpen(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({x:0.5,y:0.5}); }}
      onMouseMove={handleMouseMove}
      className="relative cursor-none overflow-hidden bg-[#f8f8f8]"
      style={{ gridColumn: isWide ? 'span 2/span 2' : undefined }}
    >
      <div className="relative overflow-hidden" style={{ paddingBottom:isWide?'52%':'75%' }}>
        <img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{
            filter: hovered ? 'grayscale(0%) brightness(0.9)' : 'grayscale(100%) brightness(1)',
            transform: hovered ? `scale(1.1) translate(${(mousePos.x-0.5)*-15}px,${(mousePos.y-0.5)*-15}px)` : 'scale(1) translate(0,0)',
          }}
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </motion.div>
  );
};

/* ─── PORTFOLIO SECTION ── */
const Portfolio = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API}/images`);
        if (!cancelled) {
          setImages(res.data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch images:', err);
        if (!cancelled) setLoading(false);
      }
    };
    fetchImages();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 md:px-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`bg-stone-50 animate-pulse ${i===0?'col-span-2 aspect-[21/9]':'aspect-square'}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 md:px-16 w-full">
          
          <div className="flex flex-col items-center mb-40 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-[10px] uppercase tracking-[0.6em] text-black/30 font-medium block mb-8"
            >
              Selected Portfolio
            </motion.span>
            <AnimatedText 
              text="Curated Architectural Works"
              className="text-6xl md:text-8xl lg:text-9xl font-serif italic leading-tight text-black"
              delay={0.2}
            />
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
              {images.map((src, i) => (
                <ProjectCard 
                  key={i} 
                  src={src} 
                  index={i} 
                  onOpen={setSelectedIndex} 
                />
              ))}
            </div>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center opacity-30">
              <div className="w-12 h-[1px] bg-black mb-8" />
              <p className="text-[10px] uppercase tracking-[0.8em]">Establishing Synchronization</p>
              <p className="text-[9px] mt-4 font-serif italic text-black/40 tracking-widest">Connect Google Drive in Admin to reveal the collection</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox 
            images={images} 
            initialIndex={selectedIndex} 
            onClose={() => setSelectedIndex(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;