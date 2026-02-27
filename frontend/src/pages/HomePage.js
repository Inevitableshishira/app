import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Footer from '../components/Footer';
import WhyUs from '../components/WhyUs';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />

      <main>
        <Hero />

        {/* PROCESS SECTION */}
        <section id="process" className="py-24 md:py-32 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <h2 className="text-4xl md:text-5xl font-serif italic text-center mb-16 md:mb-20">
              Our Seamless Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-14">
              <div className="space-y-4">
                <span className="text-3xl font-serif opacity-20">01</span>
                <h3 className="text-lg font-serif italic">Consultation</h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  We understand your vision and budget to define the strategic roadmap of the project.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-3xl font-serif opacity-20">02</span>
                <h3 className="text-lg font-serif italic">Design & Planning</h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  Detailed technical blueprints and high-fidelity 3D visualizations.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-3xl font-serif opacity-20">03</span>
                <h3 className="text-lg font-serif italic">End-to-End Execution</h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  We take full responsibility for the build — managing all procurement, vendor coordination, and on-site supervision.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-3xl font-serif opacity-20">04</span>
                <h3 className="text-lg font-serif italic">Final Handover</h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  Final handover and continued support. You move into a fully finished, ready-to-use space.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Portfolio />

        {/* SERVICES */}
        <section id="services" className="py-24 md:py-32 bg-black text-white border-t border-white/5">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <span className="block text-[10px] uppercase tracking-[0.6em] text-white/30 mb-14 text-center">
              Services
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-20">
              <div className="space-y-6 group">
                <span className="text-white/15 text-5xl font-serif group-hover:text-white/60 transition-colors duration-500">01.</span>
                <h3 className="text-xl font-serif italic">Pure Residential</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  Bespoke residential architecture, from initial concept to the final finishing touch. We manage every detail of your home's creation.
                </p>
              </div>
              <div className="space-y-6 group">
                <span className="text-white/15 text-5xl font-serif group-hover:text-white/60 transition-colors duration-500">02.</span>
                <h3 className="text-xl font-serif italic">Turnkey Design & Build</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  Comprehensive office interior solutions engineered for productivity — from space planning and 3D visualization to execution.
                </p>
              </div>
              <div className="space-y-6 group">
                <span className="text-white/15 text-5xl font-serif group-hover:text-white/60 transition-colors duration-500">03.</span>
                <h3 className="text-xl font-serif italic">General Contracting</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  High-precision execution for large-scale projects. Expert oversight, vendor management, and structural supervision.
                </p>
              </div>
            </div>
          </div>
        </section>

        <About />
        <WhyUs />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
