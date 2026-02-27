import React from 'react';

const WhyUs = () => {
  return (
    <section id="why" className="py-24 md:py-32 bg-white border-t border-black/5">
      <div className="max-w-6xl mx-auto px-8 md:px-16">

        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-serif leading-[1.05]">
            Our <br /> Commitment
          </h2>
        </div>

        <div className="space-y-14">
          {[
            {
              num: '01',
              title: 'The Wisdom of Experience',
              body: 'True expertise is knowing what not to do. We preemptively avoid design pitfalls, saving you from unnecessary risk and delay.',
            },
            {
              num: '02',
              title: 'Commitment to Trust',
              body: 'We only commit to what we can truly deliver, building long-term relationships rooted in absolute transparency.',
            },
            {
              num: '03',
              title: 'Design-Led Execution',
              body: 'We curate environments that balance aesthetic beauty with functional intent — spaces that are as purposeful as they are refined.',
            },
          ].map(({ num, title, body }) => (
            <div key={num} className="grid grid-cols-[48px_1fr] md:grid-cols-[80px_1fr] gap-6 md:gap-10 items-start border-t border-black/5 pt-10">
              <span className="text-3xl md:text-4xl font-serif text-black/15">{num}</span>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-serif">{title}</h3>
                <p className="text-sm md:text-base text-black/55 leading-relaxed font-light max-w-xl">{body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyUs;
