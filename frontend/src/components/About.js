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
            <div className="absolute -bottom-10 -right-10 bg-black text-white p-16 max-w-sm hidden md:block">
              <h4 className="text-3xl font-serif mb-6 italic">
                "Architecture is frozen music."
              </h4>
              <p className="text-white/40 text-[11px] uppercase tracking-widest leading-loose">
                The studio philosophy centers on structural honesty and absolute monochrome clarity.
              </p>
            </div>
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
