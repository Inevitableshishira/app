'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

// Dynamic imports for improved initial load speed (deferred loading)
const Portfolio = dynamic(() => import('@/components/Portfolio'), { ssr: true });
const About     = dynamic(() => import('@/components/About'),     { ssr: true });
const WhyUs     = dynamic(() => import('@/components/WhyUs'),     { ssr: true });
const Footer    = dynamic(() => import('@/components/Footer'),    { ssr: true });

import { AnimatedText } from '@/components/AnimatedText';
import { Magnetic } from '@/components/Magnetic';

const steps = [
  { n: '01', t: 'Consultation',                      p: 'We understand your vision and budget to define the strategic roadmap of the project.' },
  { n: '02', t: 'Design & Planning',                 p: 'Detailed technical blueprints and high-fidelity 3D visualizations.' },
  { n: '03', t: 'End-to-End Execution & Management', p: 'We take full responsibility for the build — managing all procurement, vendor coordination, and on-site supervision.' },
  { n: '04', t: 'Final Handover & Support',          p: 'Final handover and continued assistance. You move into a fully finished, ready-to-use space.' },
];

function ProcessStep({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 lg:border-l lg:border-black/5 lg:pl-12 group"
    >
      <div className="flex items-start justify-between">
        <Magnetic strength={0.4}>
          <span className="text-6xl font-serif text-black/10 group-hover:text-black transition-colors duration-700 cursor-default select-none block">
            {step.n}
          </span>
        </Magnetic>
      </div>
      <div className="space-y-4">
        <h3 className="text-3xl md:text-4xl font-serif tracking-tight text-black leading-tight italic">
          {step.t}
        </h3>
        <p className="text-base md:text-lg text-black/60 leading-relaxed font-light tracking-wide max-w-sm">
          {step.p}
        </p>
      </div>
    </motion.div>
  );
}

function ProcessHeading() {
  return (
    <div className="flex flex-col items-center mb-40">
      <motion.span 
        initial={{ opacity: 0, letterSpacing: '0.2em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.6em' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-[10px] uppercase tracking-[0.6em] text-black/30 mb-8 block font-medium"
      >
        Methodology
      </motion.span>
      <AnimatedText 
        text="Our Seamless Process"
        className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-center leading-none"
        delay={0.6}
      />
    </div>
  );
}

function ServiceItem({ service, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-12 group border-t border-white/10 pt-16"
    >
      <div className="flex items-center justify-between">
        <span className="text-white/10 text-7xl font-serif group-hover:text-white transition-colors duration-700">{service.n}</span>
        <div className="w-12 h-[1px] bg-white/20 group-hover:w-24 transition-all duration-700" />
      </div>
      <div className="space-y-6">
        <h3 className="text-3xl font-serif italic text-white/90">{service.t}</h3>
        <p className="text-white/40 text-base leading-relaxed font-light max-w-sm">{service.p}</p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <main className="overflow-hidden">
        <Hero />

        {/* PROCESS */}
        <section id="process" className="py-32 md:py-64 border-t border-black/5 bg-white">
          <div className="w-full px-6 md:px-16 container mx-auto max-w-[1800px]">
            <ProcessHeading />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-32">
              {steps.map((s, i) => (
                <ProcessStep key={s.n} step={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Portfolio />

        {/* SERVICES */}
        <section id="services" className="py-48 md:py-80 bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
          <div className="max-w-[1800px] mx-auto px-6 md:px-16 w-full">
            <div className="flex flex-col items-center mb-40 text-center">
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.2em' }}
                whileInView={{ opacity: 1, letterSpacing: '0.8em' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[10px] uppercase tracking-[0.8em] text-white/30 mb-8 font-medium">
                Expertise
              </motion.span>
              <AnimatedText 
                text="Our Expertise"
                className="text-6xl md:text-8xl lg:text-9xl font-serif italic leading-tight text-white/90"
                delay={0.2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 lg:gap-40">
              {[
                { n: '01', t: 'Pure Residential', p: "Bespoke residential architecture, from initial concept to the final finishing touch. We manage every detail of your home's creation to ensure a refined, stress-free build." },
                { n: '02', t: 'Turnkey Design', p: 'Comprehensive office interior solutions engineered for productivity. We handle the entire project lifecycle — from space planning and 3D visualization to material procurement and execution.' },
                { n: '03', t: 'Execution', p: 'High-precision execution for large-scale projects. We provide expert oversight, vendor management, and structural supervision to ensure builds are delivered with absolute technical accuracy.' },
              ].map((s, i) => (
                <div key={s.n} className="space-y-12 group border-t border-white/5 pt-20">
                  <Magnetic strength={0.4}>
                    <span className="text-white/5 text-8xl font-serif group-hover:text-white transition-colors duration-1000 block cursor-default select-none">
                      {s.n}
                    </span>
                  </Magnetic>
                  <div className="space-y-8">
                    <h3 className="text-4xl font-serif italic text-white/90 leading-tight tracking-tight">{s.t}</h3>
                    <p className="text-white/40 text-lg leading-relaxed font-light max-w-sm tracking-wide">{s.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <About />
        <WhyUs />
      </main>
      <Footer />
    </div>
  );
}