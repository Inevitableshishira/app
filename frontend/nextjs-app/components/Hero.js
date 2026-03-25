'use client';
import Image from 'next/image';

const Hero = () => (
  <section className="relative min-h-screen flex items-center bg-white overflow-hidden border-b border-black/5 pt-28">
    {/* Hero image — next/image handles sizing, WebP conversion, and priority loading */}
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
        <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-16">
          <i>Bespoke Residential Architecture <br />
          &amp; Turnkey Office Interiors.</i>
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <a href="#portfolio" className="px-10 py-5 bg-black text-white text-[11px] uppercase tracking-[0.3em] font-medium text-center transition-all hover:bg-black/80">
            Explore Work
          </a>
          <a href="#contact" className="px-10 py-5 border border-black text-black text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-black hover:text-white transition-all text-center">
            Contact Studio
          </a>
        </div>
      </div>
    </div>

    <div className="absolute left-12 bottom-0 w-[1px] h-32 bg-black/10 hidden lg:block" />
  </section>
);
export default Hero;
