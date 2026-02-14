import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center bg-white overflow-hidden border-b border-black/5">
      <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000" 
          alt="Architectural space" 
          className="w-full h-full object-cover img-grayscale opacity-20 lg:opacity-100 transition-opacity duration-1000"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
        <div className="max-w-2xl animate-fade-up">
          <span className="block text-[10px] uppercase tracking-[0.6em] text-black/40 mb-8">
            Est. 2026 — Architectural Studio
          </span>
          <h1 className="text-6xl md:text-9xl font-serif leading-[0.9] mb-12">
            The Art <br />
            Of <span className="italic font-normal">Precision.</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6">
            <a 
              href="#portfolio" 
              className="group relative px-10 py-5 bg-black text-white text-[11px] uppercase tracking-[0.3em] font-medium overflow-hidden transition-all text-center"
              data-testid="explore-work-button"
            >
              <span className="relative z-10">Explore Work</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
            <a 
              href="#contact" 
              className="px-10 py-5 border border-black text-black text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-black hover:text-white transition-all text-center"
              data-testid="contact-studio-button"
            >
              Contact Studio
            </a>
          </div>
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute left-8 bottom-0 w-[1px] h-32 bg-black/10 hidden lg:block"></div>
    </section>
  );
};

export default Hero;
