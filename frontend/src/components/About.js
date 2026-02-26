import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-white py-40 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              alt="Studio space" 
              className="w-full h-[700px] object-cover img-grayscale border border-black/10"
            />
          </div>

          <div className="space-y-12">
            <span className="text-black/30 uppercase tracking-[0.5em] text-[10px] block">
              Heritage / Vision
            </span>

            <h2 className="text-6xl md:text-8xl font-serif leading-none">
              Purity in <br /> Form.
            </h2>

            <p className="text-black/60 text-sm leading-relaxed max-w-lg font-light">
              Since 2026, ApexForge has operated at the intersection of brutalist honesty and contemporary minimalism. We remove the noise, leaving only the essential essence of space.
            </p>

            <div className="grid grid-cols-2 gap-16 border-t border-black/10 pt-12">
              <div>
                <span className="block text-4xl font-serif"></span>
                <span className="text-[9px] uppercase tracking-widest text-black/30">
                </span>
              </div>
              <div>
                <span className="block text-4xl font-serif"></span>
                <span className="text-[9px] uppercase tracking-widest text-black/30">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
