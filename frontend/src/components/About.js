import React from 'react';

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center bg-white border-t border-black/5"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
              alt="Studio space"
              className="w-full h-[500px] object-cover img-grayscale border border-black/10"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-10">
            <h2 className="text-4xl md:text-7xl font-serif leading-tight">
              Our Philosophy:
            </h2>

            <p className="text-base md:text-lg text-black/80 leading-[1.8] font-light">
              <b>The Art of Precision At ApexForge Studio,</b> we believe space is the physical manifestation of purpose. Established to bridge the gap between architectural vision and functional reality, we provide end-to-end solutions for those who value design integrity and operational excellence.
              <br /><br />
              A Turnkey Approach We remove the "noise" of traditional construction by integrating design and build under one roof. Our process is designed to be seamless, allowing our clients to focus on their lives and businesses while we manage the complexities of the site. From initial structural concepts to the final interior finish, we deliver spaces that are ready for immediate use.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
