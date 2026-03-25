'use client';

const points = [
  { n: '01', t: 'The Wisdom of Experience', p: 'True expertise is knowing what not to do. We preemptively avoid design pitfalls, saving you from unnecessary risk and delay.' },
  { n: '02', t: 'Commitment to Trust',       p: 'We only commit to what we can truly deliver, building long-term relationships rooted in absolute transparency.' },
  { n: '03', t: 'Design-Led Execution',      p: 'We curate environments that balance aesthetic beauty with functional intent — spaces that are as purposeful as they are refined.' },
];

const WhyUs = () => (
  <section id="why" className="bg-white py-40 border-t border-black/5">
    <div className="max-w-7xl mx-auto px-6 md:px-16">
      <div className="mb-24">
        <h2 data-scroll-anchor className="text-5xl md:text-8xl font-serif leading-none">
          Our <br /> Commitment
        </h2>
      </div>
      <div className="space-y-24">
        {points.map((p) => (
          <div key={p.n} className="grid grid-cols-1 md:grid-cols-6 gap-12 items-start">
            <div className="md:col-span-1 text-6xl font-serif text-black/20">{p.n}</div>
            <div className="md:col-span-5">
              <h3 className="text-2xl font-serif mb-6">{p.t}</h3>
              <p className="text-base md:text-lg text-black/70 leading-relaxed font-light max-w-2xl">{p.p}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default WhyUs;
