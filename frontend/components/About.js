'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

import { AnimatedText } from './AnimatedText';

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });

  return (
    <section id="about" className="bg-white py-32 md:py-48 border-t border-black/5" ref={ref}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-16 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">

          {/* Image */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-1"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-lg h-[500px] md:h-[800px] overflow-hidden group shadow-2xl shadow-black/10">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=60&w=800"
                alt="Studio space"
                fill
                loading="lazy"
                className="object-cover img-grayscale transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 512px"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-1000" />
              {/* Decorative corner marks */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-t border-l border-black/20" />
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-b border-r border-black/20" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col justify-center lg:justify-start order-1 lg:order-2">
            <div className="max-w-xl space-y-16">
              <div className="space-y-6">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-[10px] uppercase tracking-[0.6em] text-black/30 font-medium block"
                >
                  Our Vision
                </motion.span>
                <AnimatedText 
                  text="Our Philosophy:"
                  className="text-6xl md:text-8xl lg:text-9xl font-serif leading-tight italic"
                  delay={0.2}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <p className="text-base md:text-lg text-black/60 leading-relaxed font-light tracking-wide">
                  Established to bridge the gap between architectural vision and functional reality, we provide end-to-end solutions for those who value design integrity and operational excellence.
                  <br /><br />
                  A Turnkey Approach — we remove the &quot;noise&quot; of traditional construction by integrating design and build under one roof. Our process is designed to be seamless, allowing our clients to focus on their lives and businesses while we manage the complexities of the site.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
