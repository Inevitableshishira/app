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
        
{/* 🔥 ADD THIS SECTION HERE */}

<section id="process" className="py-40 px-8 max-w-7xl mx-auto">
  <h2 className="text-5xl md:text-6xl font-serif italic text-center mb-24">
    Our Seamless Process
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

    <div className="space-y-6">
      <span className="text-4xl font-serif opacity-30">01</span>
      <h3 className="text-xl font-serif italic">Consultation</h3>
      <p className="text-sm text-black/60 leading-relaxed">
        We understand your vision and budget to define the strategic roadmap of the project.
      </p>
    </div>

    <div className="space-y-6">
      <span className="text-4xl font-serif opacity-30">02</span>
      <h3 className="text-xl font-serif italic">Design & Planning</h3>
      <p className="text-sm text-black/60 leading-relaxed">
        Detailed technical blueprints and high-fidelity 3D visualizations.
      </p>
    </div>

    <div className="space-y-6">
      <span className="text-4xl font-serif opacity-30">03</span>
      <h3 className="text-xl font-serif italic">End-to-End Project Execution & Management</h3>
      <p className="text-sm text-black/60 leading-relaxed">
        We take full responsibility for the build. Our team manages all material procurement, vendor coordination, and on-site supervision to ensure flawless delivery.
      </p>
    </div>

    <div className="space-y-6">
      <span className="text-4xl font-serif opacity-30">04</span>
      <h3 className="text-xl font-serif italic">Final Handover & Support</h3>
      <p className="text-sm text-black/60 leading-relaxed">
        Final handover and continued assistance for any further support required. You move into a fully finished, ready-to-use space
      </p>
    </div>

  </div>
</section>

<Portfolio />

        
        <section id="services" className="py-48 bg-black text-white">
          <div className="max-w-7xl mx-auto px-8">
            <span className="block text-[10px] uppercase tracking-[0.6em] text-white/30 mb-20 text-center">Services</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="space-y-8 group">
                <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">01.</span>
                <h3 className="text-2xl font-serif italic">Pure Residential</h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light">Bespoke Architecture & Design "Bespoke residential architecture, from initial concept to the final finishing touch. We manage every detail of your home’s creation to ensure a refined, stress-free build that perfectly reflects your personal vision.</p>
              </div>
              <div className="space-y-8 group">
                <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">02.</span>
                <h3 className="text-2xl font-serif italic">Turnkey Design & Build</h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light">Office Space Solutions "Comprehensive office interior solutions engineered for productivity. We handle the entire project lifecycle—from space planning and 3D visualization to material procurement and execution—ensuring a seamless transition into your new workspace.</p>
              </div>
              <div className="space-y-8 group">
                <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">03.</span>
                <h3 className="text-2xl font-serif italic">General Contracting</h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light">Execution & Site Supervision "High-precision execution for large-scale projects. We provide expert oversight, vendor management, and structural supervision to ensure that complex builds are delivered with absolute technical accuracy and efficiency.</p>
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
