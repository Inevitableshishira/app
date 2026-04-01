'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedText } from './AnimatedText';
import { Magnetic } from './Magnetic';

export function ProcessStep({ step, index }) {
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

export function ProcessHeading() {
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

export function ExpertiseHeader() {
  return (
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
  );
}

export function ServiceCard({ s }) {
  return (
    <div className="space-y-12 group border-t border-white/5 pt-20">
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
  );
}
