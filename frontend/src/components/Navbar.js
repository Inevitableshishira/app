import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // slightly increased spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl py-5 border-b border-black/5 shadow-sm'
          : 'bg-transparent py-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-12 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:opacity-70 transition-opacity"
          >
            <Logo
              color="black"
              className="h-auto scale-100"
            />
          </button>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex space-x-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[11px] uppercase tracking-[0.45em] font-medium text-black/50 hover:text-black transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Inquire Button */}
        <button
          onClick={() => scrollTo('contact')}
          className="px-10 py-3 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
        >
          Inquire
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
