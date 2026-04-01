'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Logo from './Logo';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'inquiries'
  const [inquiries, setInquiries] = useState([]);
  const [images, setImages] = useState([]);
  const [settings, setSettings] = useState({ google_drive_folder_id: '', google_api_key: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'gallery') {
        fetchGallery();
        fetchSettings();
      } else {
        fetchInquiries();
      }
    }
  }, [isAuthenticated, activeTab]);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API}/images`);
      setImages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch gallery preview');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);
      setSettings({
        google_drive_folder_id: res.data.google_drive_folder_id || '',
        google_api_key: res.data.google_api_key || ''
      });
    } catch (err) {
      console.error('Failed to fetch settings');
    }
  };

  const fetchInquiries = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await axios.get(`${API}/admin/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post(`${API}/admin/login`, { username, password });
      localStorage.setItem('admin_token', res.data.access_token);
      setIsAuthenticated(true);
    } catch {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('admin_token');
    try {
      await axios.put(`${API}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Settings saved successfully!');
      fetchGallery();
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInquiries();
    } catch {
      alert('Failed to delete');
    }
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Logo color="black" className="mb-8 mx-auto" />
          <h1 className="text-3xl font-serif italic mb-2">Admin Portal</h1>
          <p className="text-[10px] uppercase tracking-widest text-black/40">Restricted Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-8 border border-black/10 p-12">
          <div className="border-b border-black/20 py-4">
            <input type="text" placeholder="USERNAME" value={username} onChange={e=>setUsername(e.target.value)} required
              className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-black/20" />
          </div>
          <div className="border-b border-black/20 py-4">
            <input type="password" placeholder="PASSWORD" value={password} onChange={e=>setPassword(e.target.value)} required
              className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-black/20" />
          </div>
          {loginError && <p className="text-red-600 text-[10px] uppercase tracking-widest">{loginError}</p>}
          <button type="submit" className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-all">
            Access Portal
          </button>
        </form>
        <div className="mt-8 text-center">
          <a href="/" className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">← Back to Site</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50/50">
      <nav className="border-b border-black/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo color="black" className="scale-75" />
            <span className="text-[10px] uppercase tracking-widest text-black/40">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 border border-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex gap-8 mb-12 border-b border-black/10 pb-4">
          <button onClick={()=>setActiveTab('gallery')}
            className={`text-[10px] uppercase tracking-[0.3em] pb-3 relative transition-all ${activeTab==='gallery'?'text-black':'text-black/30 hover:text-black'}`}>
            Gallery Setup
            {activeTab==='gallery' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
          </button>
          <button onClick={()=>setActiveTab('inquiries')}
            className={`text-[10px] uppercase tracking-[0.3em] pb-3 relative transition-all ${activeTab==='inquiries'?'text-black':'text-black/30 hover:text-black'}`}>
            Inquiries ({inquiries.length})
            {activeTab==='inquiries' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
          </button>
        </div>

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-black/10 p-8 shadow-sm">
                <h2 className="text-2xl font-serif italic mb-6">Source Settings</h2>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 font-medium">Drive Folder ID</label>
                    <input 
                      type="text" 
                      value={settings.google_drive_folder_id} 
                      onChange={e=>setSettings({...settings, google_drive_folder_id: e.target.value})}
                      placeholder="Enter Folder ID"
                      className="w-full border-b border-black/20 py-3 outline-none text-xs focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 font-medium">API Key</label>
                    <input 
                      type="password" 
                      value={settings.google_api_key} 
                      onChange={e=>setSettings({...settings, google_api_key: e.target.value})}
                      placeholder="Enter API Key"
                      className="w-full border-b border-black/20 py-3 outline-none text-xs focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <button 
                    disabled={isSaving}
                    type="submit" 
                    className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/90 transition-all disabled:bg-black/40"
                  >
                    {isSaving ? 'Saving...' : 'Sync Configuration'}
                  </button>
                </form>
                <div className="mt-8 pt-8 border-t border-black/5">
                  <p className="text-[9px] text-black/40 leading-relaxed uppercase tracking-widest">
                    Tip: The Folder ID is the last part of your Google Drive folder URL.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border border-black/10 p-8 shadow-sm min-h-[600px]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif italic">Gallery Preview</h2>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-black/30">
                    {images.length > 0 ? `${images.length} items synced` : 'Sync Pending'}
                  </span>
                </div>
                
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((src, i) => (
                      <div key={i} className="aspect-square bg-stone-100 overflow-hidden group relative">
                        <img 
                          src={src} 
                          alt="" 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center opacity-30 mt-20">
                    <div className="w-12 h-[1px] bg-black mb-8" />
                    <p className="text-[10px] uppercase tracking-[0.8em]">Establishing Synchronization</p>
                    <p className="text-[9px] mt-4 font-serif italic text-black/40 tracking-widest">Connect Google Drive to reveal the preview grid</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="max-w-4xl">
            <h2 className="text-3xl font-serif italic mb-10">Client Inquiries</h2>
            {inquiries.length === 0 ? (
              <div className="bg-white border border-black/10 p-20 text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] text-black/20">Inbox Clear</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map(inquiry => (
                  <div key={inquiry.id} className="bg-white border border-black/10 p-8 hover:border-black/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-serif mb-1 italic">{inquiry.name}</h3>
                        <p className="text-xs text-black/40 tracking-wider mb-2">{inquiry.email}</p>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-black/25">
                          {new Date(inquiry.created_at).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-[9px] uppercase tracking-[0.4em] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="bg-stone-50/50 p-6 border-l border-black/10">
                      <p className="text-sm leading-relaxed text-black/70 font-light italic">{inquiry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;