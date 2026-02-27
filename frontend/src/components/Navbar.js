import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);

    const doScroll = () => {
      const element = document.getElementById(id);
      if (!element) return;

      // Measure actual navbar height dynamically at scroll time
      const navbarHeight = navRef.current ? navRef.current.offsetHeight : 72;
      const gap = 24; // breathing room below navbar

      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const target = elementTop - navbarHeight - gap;

      window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    };

    // Wait for mobile menu close animation before scrolling
    if (menuOpen) {
      setTimeout(doScroll, 320);
    } else {
      doScroll();
    }
  };

  const navItems = [
    { label: 'Our Seamless Process', id: 'process' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' },
    { label: 'Why Us', id: 'why' },
  ];

  return (
    <>
      <nav
        ref={navRef}
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

          {/* CENTER — Desktop Navigation */}
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

          {/* RIGHT — Inquire + Hamburger */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => scrollTo('contact')}
              className="px-6 md:px-10 py-2 md:py-3 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
            >
              Inquire
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-[1.5px] bg-black transition-all duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-black transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-black transition-all duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                }`}
              />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Fullscreen Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-black/10" />

        <nav className="flex flex-col items-center gap-10 w-full px-8">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[12px] uppercase tracking-[0.5em] font-medium text-black/40 hover:text-black transition-all duration-300 w-full text-center py-2 border-b border-black/5"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => scrollTo('contact')}
            className="mt-6 px-12 py-4 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black border border-black transition-all duration-300 w-full"
            style={{
              transitionDelay: menuOpen ? `${navItems.length * 60}ms` : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            Inquire
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10" />
      </div>
    </>
  );
};

export default Navbar;
