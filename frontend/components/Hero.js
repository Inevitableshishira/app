'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedText } from './AnimatedText';
import { Magnetic } from './Magnetic';

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('nav');
    const navH = nav ? nav.offsetHeight : 80;
    const pos = el.getBoundingClientRect().top + window.pageYOffset - navH - 24;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden border-b border-black/5 pt-28">
      <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=60&w=1200"
          alt="Architectural space"
          fill
          priority
          className="object-cover img-grayscale opacity-20 lg:opacity-100"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="relative z-10 w-full lg:w-1/2 px-6 md:px-16">
        <div className="max-w-3xl">
          <AnimatedText 
            text="Bespoke Residential Architecture & Turnkey Office Interiors."
            className="text-5xl md:text-7xl font-serif italic leading-[1.1] mb-16 tracking-tight"
            delay={0.2}
          />
          
          <div className="flex flex-col sm:flex-row gap-8 mt-12">
            <Magnetic strength={0.3}>
              <button
                data-magnetic
                onClick={() => scrollTo('portfolio')}
                className="px-12 py-6 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-medium text-center transition-all hover:bg-black/80 shadow-2xl shadow-black/10"
              >
                Explore Selected Work
              </button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button
                data-magnetic
                onClick={() => scrollTo('contact')}
                className="px-12 py-6 border border-black/20 text-black text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-black hover:text-white hover:border-black transition-all text-center"
              >
                Contact Studio
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="absolute left-12 bottom-0 w-[1px] h-48 bg-black/5 hidden lg:block" />
    </section>
  );
};

export default Hero;