import React from 'react';

const WhyUs = () => {
  return (
    <section
      id="why"
      className="bg-white py-40 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Section Title */}
        <div className="mb-24">
          <h2 data-scroll-anchor className="text-5xl md:text-8xl font-serif leading-none">
            Our <br /> Commitment
          </h2>
        </div>

        {/* Points */}
        <div className="space-y-24">

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 items-start">
            <div className="md:col-span-1 text-6xl font-serif text-black/20">
              01
            </div>
            <div className="md:col-span-5">
              <h3 className="text-2xl font-serif mb-6">
                The Wisdom of Experience
              </h3>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-light max-w-2xl">
                True expertise is knowing what not to do. We preemptively avoid design pitfalls, saving you from unnecessary risk.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 items-start">
            <div className="md:col-span-1 text-6xl font-serif text-black/20">
              02
            </div>
            <div className="md:col-span-5">
              <h3 className="text-2xl font-serif mb-6">
                Commitment to Trust
              </h3>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-light max-w-2xl">
                We only commit to what we can truly deliver, building long-term relationships rooted in absolute transparency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 items-start">
            <div className="md:col-span-1 text-6xl font-serif text-black/20">
              03
            </div>
            <div className="md:col-span-5">
              <h3 className="text-2xl font-serif mb-6">
                Design-Led Execution
              </h3>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-light max-w-2xl">
                We curate environments that balance aesthetic beauty with functional intent.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyUs;
