'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { AnimatedText } from './AnimatedText';
import { Magnetic } from './Magnetic';

const points = [
  { n: '01', t: 'The Wisdom of Experience', p: 'True expertise is knowing what not to do. We preemptively avoid design pitfalls, saving you from unnecessary risk and delay.' },
  { n: '02', t: 'Commitment to Trust',       p: 'We only commit to what we can truly deliver, building long-term relationships rooted in absolute transparency.' },
  { n: '03', t: 'Design-Led Execution',      p: 'We curate environments that balance aesthetic beauty with functional intent — spaces that are as purposeful as they are refined.' },
];

const CommitmentRow = ({ point, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 md:grid-cols-6 gap-12 items-start group border-t border-black/5 pt-16"
    >
      <div className="md:col-span-1">
        <Magnetic strength={0.4}>
          <span data-magnetic className="text-7xl font-serif text-black/10 group-hover:text-black transition-colors duration-700 cursor-default select-none block">
            {point.n}
          </span>
        </Magnetic>
      </div>

      <div className="md:col-span-5 space-y-6">
        <h3 className="text-3xl md:text-4xl font-serif italic text-black/90 tracking-tight">
          {point.t}
        </h3>
        <p className="text-base md:text-lg text-black/60 leading-relaxed font-light max-w-3xl tracking-wide">{point.p}</p>
      </div>
    </motion.div>
  );
};

const WhyUs = () => {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: '0px' });

  return (
    <section id="why" className="bg-white py-32 md:py-48 border-t border-black/5">
      <div className="max-w-[1800px] mx-auto px-6 md:px-16 container">

        <div ref={headRef} className="mb-24 md:mb-40 flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.6em] text-black/30 font-medium block mb-8"
          >
            Values
          </motion.span>
          <AnimatedText 
            text="Our Commitment"
            className="text-6xl md:text-8xl lg:text-9xl font-serif leading-tight italic"
            delay={0.2}
          />
        </div>

        <div className="space-y-16">
          {points.map((p, i) => (
            <CommitmentRow key={p.n} point={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhyUs;
