import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden border-b border-black/5 pt-28">

      {/* RIGHT SIDE IMAGE */}
      <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000"
          alt="Architectural space"
          className="w-full h-full object-cover img-grayscale opacity-20 lg:opacity-100"
        />
      </div>

      {/* LEFT SIDE CONTENT */}
      <div className="relative z-10 w-full lg:w-1/2 px-12">
        <div className="max-w-3xl">

          {/* Studio Label */}
          <span className="block text-[10px] uppercase tracking-[0.6em] text-black/40 mb-10">
            Est. 2026 — Architectural Studio
          </span>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-16">
            Bespoke Residential Architecture <br />
            & Turnkey Office Interiors.
          </h1>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <a
              href="#portfolio"
              className="px-10 py-5 bg-black text-white text-[11px] uppercase tracking-[0.3em] font-medium text-center transition-all"
            >
              Explore Work
            </a>

            <a
              href="#contact"
              className="px-10 py-5 border border-black text-black text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-black hover:text-white transition-all text-center"
            >
              Contact Studio
            </a>
          </div>

        </div>
      </div>

      {/* Decorative Vertical Line */}
      <div className="absolute left-12 bottom-0 w-[1px] h-32 bg-black/10 hidden lg:block"></div>

    </section>
  );
};

export default Hero;
