'use client';
import Image from 'next/image';

const About = () => (
  <section id="about" className="bg-white py-40 border-t border-black/5">
    <div className="max-w-7xl mx-auto px-6 md:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg h-[700px]">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=60&w=800"
              alt="Studio space"
              fill
              loading="lazy"
              className="object-cover img-grayscale border border-black/10"
              sizes="(max-width: 1024px) 100vw, 512px"
            />
          </div>
        </div>
        <div className="flex justify-center lg:justify-start">
          <div className="max-w-xl space-y-12">
            <h2 data-scroll-anchor className="text-5xl md:text-8xl font-serif leading-none">
              Our Philosophy:
            </h2>
            <p className="text-base md:text-lg text-black/80 leading-relaxed font-light">
              <b>The Art of Precision At ApexForge Studio,</b> we believe space is the physical manifestation of purpose.
              Established to bridge the gap between architectural vision and functional reality, we provide end-to-end
              solutions for those who value design integrity and operational excellence.
              <br /><br />
              A Turnkey Approach — we remove the &quot;noise&quot; of traditional construction by integrating design and build
              under one roof. Our process is designed to be seamless, allowing our clients to focus on their lives and
              businesses while we manage the complexities of the site.
            </p>
            <div className="border-t border-black/10 pt-8" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default About;
