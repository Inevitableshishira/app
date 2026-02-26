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
    const yOffset = -60; // adjust based on navbar height
    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth"
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
          ? 'bg-white/70 backdrop-blur-md border-b border-black/5 py-4'
          : 'bg-white py-6'
      }`}
    >
      <div className="w-full px-6 md:px-16 flex items-center justify-between">

        {/* LEFT — Logo */}
        <div className="flex-shrink-0">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center"
          >
            <Logo className="h-auto" />
          </button>
        </div>

        {/* CENTER — Desktop Navigation Only */}
        <div className="hidden md:flex space-x-14">
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
        <div className="flex-shrink-0">
          <button
            onClick={() => scrollTo('contact')}
            className="px-6 md:px-10 py-2 md:py-3 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
          >
            Inquire
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
