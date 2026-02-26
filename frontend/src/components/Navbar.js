import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { label: 'Our Seamless Process', id: 'process' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-md border-b border-black/5 py-5'
          : 'bg-white py-8'
      }`}
    >
      <div className="w-full px-16 flex items-center justify-between">

        {/* LEFT — Logo */}
        <div className="flex items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left"
          >
            <Logo className="h-auto" />
          </button>
        </div>

        {/* CENTER — Navigation */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-14">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[11px] uppercase tracking-[0.45em] font-medium text-black/60 hover:text-black transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT — Inquire */}
        <div>
          <button
            onClick={() => scrollTo('contact')}
            className="px-10 py-3 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
          >
            Inquire
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
