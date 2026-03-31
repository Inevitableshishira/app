'use client';
import { useState } from 'react';
import axios from 'axios';
import Logo from './Logo';
import { AnimatedText } from './AnimatedText';
import { Magnetic } from './Magnetic';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const Footer = () => {
  const [form, setForm]         = useState({ name: '', email: '', message: '' });
  const [status, setStatus]     = useState('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      await axios.post(`${API}/contact`, form);
      setStatus('success');
      setFeedback('Our team will reach out soon.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
      setFeedback('Something went wrong. Please try again.');
    }
  };

  return (
    <footer id="contact" className="bg-black text-white py-40 border-t border-white/[0.03]">
      <div className="max-w-[1800px] mx-auto px-6 md:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-48">

          {/* LEFT: Heading & Info */}
          <div className="space-y-20">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-medium block">
                Connect
              </span>
              <AnimatedText 
                text="Let's build tomorrow."
                className="text-6xl md:text-8xl font-serif italic text-white leading-none tracking-tighter"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8">
              <div className="space-y-4">
                <h4 className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold mb-4">The Studio</h4>
                <address className="text-sm font-light text-white/50 not-italic leading-relaxed">
                  ApexForge Studio Pvt Ltd<br />
                  #34A, 2nd Floor, 22nd Main Rd<br />
                  HSR Layout, Bengaluru, 560102
                </address>
              </div>
              <div className="space-y-4">
                <h4 className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold mb-4">Direct Contact</h4>
                <div className="text-sm font-light text-white/50 space-y-2">
                  <a href="mailto:shreesha@apexforgestudio.in" className="hover:text-white transition-colors block">
                    shreesha@apexforgestudio.in
                  </a>
                  <a href="tel:+919448815530" className="hover:text-white transition-colors block">+91 9448815530</a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:pl-8">
            {status === 'success' ? (
              <div className="border border-white/5 p-12 bg-white/[0.01]">
                <h3 className="text-3xl font-serif italic mb-4">Project Initialized.</h3>
                <p className="text-white/40 text-sm mb-8">{feedback}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-[10px] uppercase tracking-[0.4em] border-b border-white/20 pb-1 hover:border-white transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-10">
                  <div className="border-b border-white/20 py-5 focus-within:border-white transition-colors">
                    <input required type="text" placeholder="NAME" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-transparent outline-none text-xs tracking-[0.2em] placeholder:text-white/30 uppercase" />
                  </div>
                  <div className="border-b border-white/20 py-5 focus-within:border-white transition-colors">
                    <input required type="email" placeholder="EMAIL" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent outline-none text-xs tracking-[0.2em] placeholder:text-white/30 uppercase" />
                  </div>
                  <div className="border-b border-white/20 py-5 focus-within:border-white transition-colors">
                    <textarea required rows="2" placeholder="TELL US ABOUT YOUR VISION" value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-transparent outline-none text-xs tracking-[0.2em] placeholder:text-white/30 resize-none overflow-hidden uppercase" />
                  </div>
                </div>
                <Magnetic strength={0.2}>
                  <button
                    data-magnetic
                    disabled={status === 'loading'}
                    className="px-16 py-6 bg-white text-black text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-white/90 transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'Submit Vision'}
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </div>
 
        {/* BOTTOM */}
        <div className="pt-20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo color="white" />
          </button>
          <div className="flex gap-12">
            <Magnetic strength={0.2}><a href="#" data-magnetic className="text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors">Instagram</a></Magnetic>
            <Magnetic strength={0.2}><a href="#" data-magnetic className="text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors">LinkedIn</a></Magnetic>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/10 font-medium">
            © 2026 APEXFORGE STUDIO.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;