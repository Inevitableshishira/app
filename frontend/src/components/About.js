import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-white border-t border-black/5">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT — IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
              alt="Studio space"
              className="w-full max-w-md lg:max-w-lg h-[420px] md:h-[520px] object-cover border border-black/8"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>

          {/* RIGHT — TEXT */}
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif leading-[1.05]">
              Our Philosophy:
            </h2>
            <div className="space-y-6 text-sm md:text-base text-black/65 leading-relaxed font-light">
              <p>
                <strong className="text-black font-medium">The Art of Precision.</strong> At ApexForge Studio, we believe space is the physical manifestation of purpose. Established to bridge the gap between architectural vision and functional reality, we provide end-to-end solutions for those who value design integrity and operational excellence.
              </p>
              <p>
                <strong className="text-black font-medium">A Turnkey Approach.</strong> We remove the noise of traditional construction by integrating design and build under one roof — allowing our clients to focus on their lives and businesses while we manage every complexity of the site.
              </p>
            </div>
            <div className="border-t border-black/10 pt-6" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
