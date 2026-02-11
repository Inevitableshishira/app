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
      const offset = 80;
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
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-white/70 backdrop-blur-xl py-4 border-b border-black/5 shadow-sm' 
        : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:opacity-70 transition-opacity"
          data-testid="logo-button"
        >
          <Logo color="black" className="h-auto scale-90 md:scale-100 transition-transform duration-500" />
        </button>
        
        <div className="hidden md:flex space-x-12">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollTo(item.id)}
              className="text-[10px] uppercase tracking-[0.4em] font-medium text-black/50 hover:text-black transition-all relative py-2"
              data-testid={`nav-${item.id}`}
            >
              {item.label}
              <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full opacity-0"></span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => scrollTo('contact')}
          className="px-8 py-2.5 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
          data-testid="inquire-button"
        >
          Inquire
        </button>
      </div>
    </nav>
  );
};

export default Navbar;