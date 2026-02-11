import React from 'react';

const TEAM = [
  {
    name: 'Elena Vance',
    role: 'Principal Architect',
    bio: 'Pritzker prize nominee focused on sustainable brutalism and residential retreats.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Marcus Thorne',
    role: 'Director of Workplace Design',
    bio: 'Pioneer in behavioral ergonomics and next-generation office productivity.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  }
];

const About = () => {
  return (
    <section id="about" className="bg-white py-40 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-40">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              alt="Studio space" 
              className="w-full h-[700px] object-cover img-grayscale border border-black/10"
            />
            <div className="absolute -bottom-10 -right-10 bg-black text-white p-16 max-w-sm hidden md:block">
              <h4 className="text-3xl font-serif mb-6 italic">"Architecture is frozen music."</h4>
              <p className="text-white/40 text-[11px] uppercase tracking-widest leading-loose">The studio philosophy centers on structural honesty and absolute monochrome clarity.</p>
            </div>
          </div>
          <div className="space-y-12">
            <span className="text-black/30 uppercase tracking-[0.5em] text-[10px] block">Heritage / Vision</span>
            <h2 className="text-6xl md:text-8xl font-serif leading-none">Purity in <br />Form.</h2>
            <p className="text-black/60 text-sm leading-relaxed max-w-lg font-light">
              Since 2012, ApexForge has operated at the intersection of brutalist honesty and contemporary minimalism. We remove the noise, leaving only the essential essence of space.
            </p>
            <div className="grid grid-cols-2 gap-16 border-t border-black/10 pt-12">
              <div>
                <span className="block text-4xl font-serif">150+</span>
                <span className="text-[9px] uppercase tracking-widest text-black/30">Curated Projects</span>
              </div>
              <div>
                <span className="block text-4xl font-serif">24</span>
                <span className="text-[9px] uppercase tracking-widest text-black/30">Metropolises</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-black">
          <h3 className="text-[10px] uppercase tracking-[0.6em] mb-20 text-center opacity-40">The Architects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
             {TEAM.map((member, i) => (
               <div key={i} className="group border-l border-black/10 pl-10 hover:border-black transition-colors">
                 <div className="aspect-[4/5] overflow-hidden mb-10 border border-black/5">
                   <img src={member.image} alt={member.name} className="w-full h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-1000" />
                 </div>
                 <h4 className="text-2xl font-serif italic mb-2">{member.name}</h4>
                 <p className="text-[10px] text-black/40 uppercase tracking-[0.3em] mb-6">{member.role}</p>
                 <p className="text-sm text-black/60 leading-relaxed font-light">{member.bio}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;