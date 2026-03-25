'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
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
      const navH   = navRef.current ? navRef.current.offsetHeight : 72;
      const anchor = section.querySelector('[data-scroll-anchor]') || section;
      window.scrollTo({ top: anchor.getBoundingClientRect().top + window.pageYOffset - navH - 24, behavior: 'smooth' });
    };
    if (menuOpenRef.current) { setMenuOpen(false); setTimeout(doScroll, 350); }
    else doScroll();
  }, []);

  const navItems = [
    { label: 'Our Seamless Process', id: 'process' },
    { label: 'Portfolio',            id: 'portfolio' },
    { label: 'Services',             id: 'services' },
    { label: 'About',                id: 'about' },
    { label: 'Why Us',               id: 'why' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/70 backdrop-blur-md border-b border-black/5 py-4' : 'bg-white py-6'
        }`}
      >
        <div className="w-full px-6 md:px-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center">
              <Logo />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.4em] font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-black bg-black/[0.04] border border-black/20'
                      : 'text-black/50 hover:text-black border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => scrollTo('contact')}
              className="px-6 md:px-10 py-2 md:py-3 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
            >
              Inquire
            </button>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-[1.5px] bg-black transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-black transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-5 right-6 flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          aria-label="Close menu"
        >
          <span className="block w-6 h-[1.5px] bg-black rotate-45 translate-y-[0.75px]" />
          <span className="block w-6 h-[1.5px] bg-black -rotate-45 -translate-y-[0.75px]" />
        </button>

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
      </div>
    </>
  );
};
export default Navbar;
