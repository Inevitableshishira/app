import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

// Sub-components as client-side isolated features
import { 
  ProcessStep, 
  ProcessHeading, 
  ExpertiseHeader, 
  ServiceCard 
} from '@/components/HomePageClient';

// Dynamic imports for improved initial load speed
const Portfolio = dynamic(() => import('@/components/Portfolio'), { ssr: true });
const About     = dynamic(() => import('@/components/About'),     { ssr: true });
const WhyUs     = dynamic(() => import('@/components/WhyUs'),     { ssr: true });
const Footer    = dynamic(() => import('@/components/Footer'),    { ssr: true });

const steps = [
  { n: '01', t: 'Consultation',                      p: 'We understand your vision and budget to define the strategic roadmap of the project.' },
  { n: '02', t: 'Design & Planning',                 p: 'Detailed technical blueprints and high-fidelity 3D visualizations.' },
  { n: '03', t: 'End-to-End Execution & Management', p: 'We take full responsibility for the build — managing all procurement, vendor coordination, and on-site supervision.' },
  { n: '04', t: 'Final Handover & Support',          p: 'Final handover and continued assistance. You move into a fully finished, ready-to-use space.' },
];

const expertise = [
  { n: '01', t: 'Pure Residential', p: "Bespoke residential architecture, from initial concept to the final finishing touch. We manage every detail of your home's creation to ensure a refined, stress-free build." },
  { n: '02', t: 'Turnkey Design', p: 'Comprehensive office interior solutions engineered for productivity. We handle the entire project lifecycle — from space planning and 3D visualization to material procurement and execution.' },
  { n: '03', t: 'Execution', p: 'High-precision execution for large-scale projects. We provide expert oversight, vendor management, and structural supervision to ensure builds are delivered with absolute technical accuracy.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <main className="overflow-hidden">
        <Hero />

        {/* PROCESS */}
        <section id="process" className="py-32 md:py-64 border-t border-black/5 bg-white">
          <div className="w-full px-6 md:px-16 container mx-auto max-w-[1800px]">
            <ProcessHeading />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-32">
              {steps.map((s, i) => (
                <ProcessStep key={s.n} step={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Portfolio />

        {/* SERVICES */}
        <section id="services" className="py-48 md:py-80 bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
          <div className="max-w-[1800px] mx-auto px-6 md:px-16 w-full">
            <ExpertiseHeader />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 lg:gap-40">
              {expertise.map((s) => (
                <ServiceCard key={s.n} s={s} />
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