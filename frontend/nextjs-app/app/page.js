'use client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import WhyUs from '@/components/WhyUs';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <CustomCursor />
      <Navbar />

      <main>
        <Hero />

        {/* PROCESS */}
        <section id="process" className="py-32 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <h2 data-scroll-anchor className="text-5xl md:text-6xl font-serif italic text-center mb-24">
              Our Seamless Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
              {[
                { n: '01', t: 'Consultation', p: 'We understand your vision and budget to define the strategic roadmap of the project.' },
                { n: '02', t: 'Design & Planning', p: 'Detailed technical blueprints and high-fidelity 3D visualizations.' },
                { n: '03', t: 'End-to-End Execution & Management', p: 'We take full responsibility for the build — managing all procurement, vendor coordination, and on-site supervision.' },
                { n: '04', t: 'Final Handover & Support', p: 'Final handover and continued assistance. You move into a fully finished, ready-to-use space.' },
              ].map((s) => (
                <div key={s.n} className="space-y-6">
                  <span className="text-4xl font-serif opacity-30">{s.n}</span>
                  <h3 className="text-xl font-serif italic">{s.t}</h3>
                  <p className="text-sm text-black/60 leading-relaxed">{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Portfolio />

        {/* SERVICES */}
        <section id="services" className="py-48 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <span data-scroll-anchor className="block text-[10px] uppercase tracking-[0.6em] text-white/30 mb-20 text-center">
              Services
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              {[
                { n: '01.', t: 'Pure Residential', p: "Bespoke residential architecture, from initial concept to the final finishing touch. We manage every detail of your home's creation to ensure a refined, stress-free build." },
                { n: '02.', t: 'Turnkey Design & Build', p: 'Comprehensive office interior solutions engineered for productivity. We handle the entire project lifecycle — from space planning and 3D visualization to material procurement and execution.' },
                { n: '03.', t: 'General Contracting', p: 'High-precision execution for large-scale projects. We provide expert oversight, vendor management, and structural supervision to ensure builds are delivered with absolute technical accuracy.' },
              ].map((s) => (
                <div key={s.n} className="space-y-8 group">
                  <span className="text-white/20 text-6xl font-serif group-hover:text-white transition-colors duration-500">{s.n}</span>
                  <h3 className="text-2xl font-serif italic">{s.t}</h3>
                  <p className="text-white/40 text-[13px] leading-relaxed font-light">{s.p}</p>
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
