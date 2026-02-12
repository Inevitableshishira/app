import React, { useState } from 'react';
import Logo from './Logo';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    try {
      await axios.post(`${API}/contact`, formData);
      setStatus('success');
      setFeedback('Our team will reach out soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setFeedback('Something went wrong. Please try again.');
      console.error('Contact form error:', error);
    }
  };

  return (
    <footer id="contact" className="bg-black text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-40">
          <div className="animate-fade-up">
            <h2 className="text-5xl md:text-8xl font-serif mb-12 italic leading-none">Let's build <br />tomorrow.</h2>
            <div className="grid grid-cols-2 gap-12 mt-20">
              <div className="space-y-2">
                <p className="text-white/30 uppercase tracking-widest text-[9px]">Location</p>
                <p className="text-sm font-light">HSR Layout,Bangalore <br />Via Design 42</p>
              </div>
              <div className="space-y-2">
                <p className="text-white/30 uppercase tracking-widest text-[9px]">Contact</p>
                <p className="text-sm font-light">studio@apexforge.com</p>
              </div>
            </div>
          </div>

          <div className="relative">
            {status === 'success' ? (
              <div className="h-full flex flex-col justify-center items-start border border-white/10 p-12 bg-white/5 animate-fade-up">
                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-4 italic">Vision Received</span>
                <h3 className="text-3xl font-serif mb-6 italic">Thank you.</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm">
                  {feedback}
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-[10px] uppercase tracking-widest border-b border-white pb-1 hover:opacity-50 transition-opacity"
                  data-testid="send-another-button"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-12" data-testid="contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="border-b border-white/20 py-4 focus-within:border-white transition-colors">
                    <input 
                      required
                      type="text" 
                      placeholder="NAME"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-white/20"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div className="border-b border-white/20 py-4 focus-within:border-white transition-colors">
                    <input 
                      required
                      type="email" 
                      placeholder="EMAIL"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-white/20"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>
                <div className="border-b border-white/20 py-4 focus-within:border-white transition-colors">
                  <textarea 
                    required
                    rows={3}
                    placeholder="TELL US ABOUT YOUR VISION"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-white/20 resize-none"
                    data-testid="contact-message-input"
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full py-6 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50"
                  data-testid="contact-submit-button"
                >
                  {status === 'loading' ? 'Processing...' : 'Submit Vision'}
                </button>
                {status === 'error' && <p className="text-red-400 text-[10px] uppercase tracking-widest mt-4" data-testid="contact-error">{feedback}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo color="white" className="h-auto opacity-90 scale-90 md:scale-100" />
          <div className="flex gap-12">
            {['Instagram', 'LinkedIn', 'Behance'].map(s => (
              <a key={s} href="#" className="text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">{s}</a>
            ))}
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">© 2026 APEXFORGE STUDIO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
