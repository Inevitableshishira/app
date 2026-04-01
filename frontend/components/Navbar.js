'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Logo from './Logo';
import { Magnetic } from './Magnetic';

const Navbar = () => {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef      = useRef(null);
  const menuOpenRef = useRef(false);

  useEffect(() => { menuOpenRef.current = menuOpen; }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const ids  = ['process', 'portfolio', 'services', 'about', 'why'];
      const navH = navRef.current ? navRef.current.offsetHeight : 72;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - navH - 40 <= 0) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = useCallback((id) => {
    const doScroll = () => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect   = section.getBoundingClientRect();
      const offset = (window.innerHeight - rect.height) / 2;
      const target = rect.top + window.pageYOffset - (offset > 0 ? offset : 0);
      window.scrollTo({ top: target - 20, behavior: 'smooth' });
    };
    if (menuOpenRef.current) { setMenuOpen(false); setTimeout(doScroll, 400); }
    else doScroll();
  }, []);

  const navItems = [
    { label: 'Process',      id: 'process' },
    { label: 'Portfolio',    id: 'portfolio' },
    { label: 'Services',     id: 'services' },
    { label: 'About',        id: 'about' },
    { label: 'Why Us',       id: 'why' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.03] py-4' : 'bg-white py-8'
        }`}
      >
        <div className="w-full px-6 md:px-16 grid grid-cols-3 md:flex items-center md:justify-between mx-auto max-w-[1800px]">
          
          {/* LEFT: Mobile Menu Toggle / Desktop Logo */}
          <div className="flex items-center order-1 md:order-none">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] -ml-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-[1.5px] bg-black transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-black transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
            <div className="hidden md:block flex-shrink-0">
              <Magnetic strength={0.2}>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center"
                >
                  <Logo />
                </button>
              </Magnetic>
            </div>
          </div>

          {/* CENTER: Mobile Logo / Desktop Nav-Links */}
          <div className="flex justify-center items-center order-2 md:order-none">
            <div className="md:hidden">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center h-8"
              >
                <Logo />
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Magnetic key={item.id} strength={0.2}>
                    <button
                      data-magnetic
                      onClick={() => scrollTo(item.id)}
                      className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] font-medium transition-all duration-500 ${
                        isActive
                          ? 'text-black bg-black/[0.04] border border-black/10'
                          : 'text-black/40 hover:text-black border border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  </Magnetic>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Empty (was Inquire) */}
          <div className="md:flex justify-end items-center order-3 md:order-none">
            <div className="hidden md:block">
              <Magnetic strength={0.3}>
                <button
                  data-magnetic
                  onClick={() => scrollTo('contact')}
                  className="px-12 py-3 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/80 transition-all shadow-xl shadow-black/5"
                >
                  Inquire
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white/95 backdrop-blur-2xl flex flex-col justify-center items-center transition-all duration-700 md:hidden ${
          menuOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-8 right-8 flex flex-col justify-center items-center w-12 h-12 gap-[5px]"
          aria-label="Close menu"
        >
          <span className="block w-10 h-[1px] bg-black rotate-45 translate-y-[0.5px]" />
          <span className="block w-10 h-[1px] bg-black -rotate-45 -translate-y-[0.5px]" />
        </button>
 
        <nav className="flex flex-col items-center gap-10 w-full px-12">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[16px] uppercase tracking-[0.5em] font-medium text-black/40 hover:text-black transition-all duration-500 w-full text-center py-6 border-b border-black/5"
              style={{
                transitionDelay: menuOpen ? `${i * 80 + 200}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(30px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="mt-20 px-16 py-8 bg-black text-white text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-all duration-500 w-full shadow-2xl shadow-black/10"
            style={{
              transitionDelay: menuOpen ? `${navItems.length * 80 + 200}ms` : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            Inquire
          </button>
        </nav>
      </div>
    </>
  );
};
export default Navbar;