import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        
        {/* Intro Text Section */}
        <section className="py-48 px-8 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] italic animate-fade-up">
            "Space is not an empty volume; it is the physical manifestation of silence."
          </h2>
          <div className="w-32 h-[1px] bg-black mx-auto mt-20 opacity-20"></div>
        </section>

        <Portfolio />
        
        <section id="services" className="py-48 bg-black text-white">
          <div className="max-w-7xl mx-auto px-8">
            <span className="block text-[10px] uppercase tracking-[0.6em] text-white/30 mb-20 text-center">Capabilities</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="space-y-8 group">
                <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">01.</span>
                <h3 className="text-2xl font-serif italic">Pure Residential</h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light">Absolute sanctuaries designed for private contemplation. Minimalist retreats that emphasize the horizon.</p>
              </div>
              <div className="space-y-8 group">
                <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">02.</span>
                <h3 className="text-2xl font-serif italic">Structural Workspace</h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light">High-precision environments that catalyze focus. Architecture optimized for deep technical work.</p>
              </div>
              <div className="space-y-8 group">
                <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">03.</span>
                <h3 className="text-2xl font-serif italic">Urban Monoliths</h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light">Mixed-use structures that define city skylines through geometric purity and material honesty.</p>
              </div>
            </div>
          </div>
        </section>

        <About />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;