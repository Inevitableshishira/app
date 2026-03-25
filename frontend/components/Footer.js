'use client';
import { useState } from 'react';
import axios from 'axios';
import Logo from './Logo';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const Footer = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState('idle');
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
    <footer id="contact" className="bg-black text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-40">

          {/* LEFT */}
          <div>
            <h2 className="text-5xl md:text-8xl font-serif mb-12 italic leading-none">
              Let&apos;s build <br /> tomorrow.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
              <div className="space-y-2">
                <p className="text-white/30 uppercase tracking-widest text-[9px]">Location</p>
                <p className="text-sm font-light">
                  ApexForge Studio Private Limited<br />
                  #34A, 2nd Floor<br />
                  22nd Main Rd, HSR Layout<br />
                  Bengaluru, Karnataka 560102
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-white/30 uppercase tracking-widest text-[9px]">Contact</p>
                <p className="text-sm font-light">
                  <a href="mailto:shreesha@apexforgestudio.in" className="hover:underline">shreesha@apexforgestudio.in</a>
                  <br /><br />
                  Shreesha J<br />
                  <a href="tel:+919448815530" className="hover:underline">+91 9448815530</a>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div>
            {status === 'success' ? (
              <div className="border border-white/10 p-12 bg-white/5">
                <span className="text-[10px] uppercase tracking-widest text-white/40 italic">Vision Received</span>
                <h3 className="text-3xl font-serif mt-4 mb-6 italic">Thank you.</h3>
                <p className="text-white/60 text-sm mb-10">{feedback}</p>
                <button onClick={() => setStatus('idle')} className="text-[10px] uppercase tracking-widest border-b border-white pb-1 hover:opacity-50">
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="border-b border-white/20 py-4">
                    <input required type="text" placeholder="NAME" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-white/20" />
                  </div>
                  <div className="border-b border-white/20 py-4">
                    <input required type="email" placeholder="EMAIL" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-white/20" />
                  </div>
                </div>
                <div className="border-b border-white/20 py-4">
                  <textarea required rows="3" placeholder="TELL US ABOUT YOUR VISION" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-white/20 resize-none" />
                </div>
                <button disabled={status === 'loading'}
                  className="w-full py-6 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white/90 transition-all disabled:opacity-50">
                  {status === 'loading' ? 'Processing...' : 'Submit Vision'}
                </button>
                {status === 'error' && <p className="text-red-400 text-[10px] uppercase tracking-widest">{feedback}</p>}
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo color="white" />
          <div className="flex gap-12">
            <a href="#" className="text-[9px] uppercase tracking-widest text-white/40 hover:text-white">Instagram</a>
            <a href="#" className="text-[9px] uppercase tracking-widest text-white/40 hover:text-white">LinkedIn</a>
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">
            © 2026 APEXFORGE STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
