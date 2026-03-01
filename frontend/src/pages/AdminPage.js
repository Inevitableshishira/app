import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../components/Logo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Convert Google Drive share links to direct image URLs
const toDirectUrl = (url) => {
  if (!url) return url;
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch && url.includes('drive.google.com')) return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  return url;
};

const EMPTY_FORM = {
  title: '',
  category: 'Residential',
  image: '',
  images: [],
  year: new Date().getFullYear().toString(),
  location: '',
  description: ''
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_FORM);
  const [extraImageInput, setExtraImageInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) { setIsAuthenticated(true); fetchData(); }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    try {
      if (activeTab === 'projects') {
        const res = await axios.get(`${API}/projects`);
        setProjects(res.data);
      } else {
        const res = await axios.get(`${API}/admin/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(res.data);
      }
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
      setUsername(''); setPassword('');
    } catch {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      if (editingProject) {
        await axios.put(`${API}/admin/projects/${editingProject.id}`, projectForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/admin/projects`, projectForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      cancelEdit();
      fetchData();
    } catch {
      alert('Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { alert('Failed to delete'); }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { alert('Failed to delete'); }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      category: project.category,
      image: project.image,
      images: project.images || [],
      year: project.year,
      location: project.location,
      description: project.description
    });
    setShowProjectForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setShowProjectForm(false);
    setProjectForm(EMPTY_FORM);
    setExtraImageInput('');
  };

  const addExtraImage = () => {
    const url = extraImageInput.trim();
    if (!url) return;
    setProjectForm(f => ({ ...f, images: [...(f.images || []), toDirectUrl(url)] }));
    setExtraImageInput('');
  };

  const removeExtraImage = (idx) => {
    setProjectForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  /* ── LOGIN ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <Logo color="black" className="mb-8" />
            <h1 className="text-3xl font-serif italic mb-2">Admin Portal</h1>
            <p className="text-[10px] uppercase tracking-widest text-black/40">Restricted Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8 border border-black/10 p-12" data-testid="admin-login-form">
            <div className="border-b border-black/20 py-4">
              <input type="text" placeholder="USERNAME" value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-black/20"
                required data-testid="admin-username-input" />
            </div>
            <div className="border-b border-black/20 py-4">
              <input type="password" placeholder="PASSWORD" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-black/20"
                required data-testid="admin-password-input" />
            </div>
            {loginError && <p className="text-red-600 text-[10px] uppercase tracking-widest">{loginError}</p>}
            <button type="submit"
              className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-all"
              data-testid="admin-login-button">
              Access Portal
            </button>
          </form>
          <div className="mt-8 text-center">
            <a href="/" className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">← Back to Site</a>
          </div>
        </div>
      </div>
    );
  }

  /* ── DASHBOARD ── */
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-black/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo color="black" className="scale-75" />
            <span className="text-[10px] uppercase tracking-widest text-black/40">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout}
            className="px-6 py-2 border border-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
            data-testid="admin-logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* TABS */}
        <div className="flex gap-8 mb-12 border-b border-black/10 pb-4">
          {['projects', 'inquiries'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-[10px] uppercase tracking-[0.3em] pb-2 relative ${activeTab === tab ? 'text-black' : 'text-black/40 hover:text-black'}`}
              data-testid={`tab-${tab}`}>
              {tab === 'projects' ? `Projects (${projects.length})` : `Inquiries (${inquiries.length})`}
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
            </button>
          ))}
        </div>

        {/* ── PROJECTS TAB ── */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif italic">Manage Projects</h2>
              {!showProjectForm && (
                <button onClick={() => setShowProjectForm(true)}
                  className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-black/90 transition-all"
                  data-testid="add-project-button">
                  + Add Project
                </button>
              )}
            </div>

            {/* FORM */}
            {showProjectForm && (
              <form onSubmit={handleSaveProject}
                className="mb-12 border border-black/10 p-8 space-y-6 bg-stone-50"
                data-testid="project-form">
                <h3 className="text-xl font-serif italic">{editingProject ? 'Edit Project' : 'New Project'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Title</label>
                    <input type="text" value={projectForm.title} required
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors bg-transparent"
                      data-testid="project-title-input" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Category</label>
                    <select value={projectForm.category}
                      onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors bg-transparent"
                      data-testid="project-category-select">
                      <option>Residential</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Year</label>
                    <input type="text" value={projectForm.year} required
                      onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors bg-transparent"
                      data-testid="project-year-input" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Location</label>
                    <input type="text" value={projectForm.location} required
                      onChange={e => setProjectForm({ ...projectForm, location: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors bg-transparent"
                      data-testid="project-location-input" />
                  </div>
                </div>

                {/* COVER IMAGE */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Cover Image URL <span className="text-black/25">(shown on portfolio grid)</span></label>
                  <input type="url" value={projectForm.image} required
                    onChange={e => setProjectForm({ ...projectForm, image: toDirectUrl(e.target.value) })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors bg-transparent"
                    data-testid="project-image-input" />
                  {projectForm.image && (
                    <img src={projectForm.image} alt="preview"
                      className="mt-3 h-24 w-40 object-cover border border-black/10 img-grayscale" />
                  )}
                </div>

                {/* EXTRA IMAGES */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">
                    Additional Images <span className="text-black/25">(shown in lightbox gallery)</span>
                  </label>

                  {/* existing extra images */}
                  {(projectForm.images || []).length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {(projectForm.images || []).map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt=""
                            className="h-20 w-28 object-cover border border-black/10 img-grayscale" />
                          <button type="button" onClick={() => removeExtraImage(idx)}
                            className="absolute top-1 right-1 bg-black text-white w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* add new extra image */}
                  <div className="flex gap-3">
                    <input type="url" value={extraImageInput}
                      onChange={e => setExtraImageInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addExtraImage())}
                      placeholder="Paste image URL and click Add"
                      className="flex-1 border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors bg-transparent" />
                    <button type="button" onClick={addExtraImage}
                      className="px-4 py-2 border border-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-all whitespace-nowrap">
                      + Add
                    </button>
                  </div>
                  <p className="text-[9px] text-black/30 mt-2 tracking-wide">
                    Add up to 10 images. Press Enter or click Add after each URL.
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Description</label>
                  <textarea value={projectForm.description} required rows="3"
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full border border-black/20 p-4 outline-none text-sm focus:border-black transition-colors resize-none bg-transparent"
                    data-testid="project-description-input" />
                </div>

                <div className="flex gap-4">
                  <button type="submit"
                    className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-black/90 transition-all"
                    data-testid="project-save-button">
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="px-6 py-3 border border-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
                    data-testid="project-cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* PROJECT LIST */}
            <div className="grid grid-cols-1 gap-6">
              {projects.map(project => (
                <div key={project.id}
                  className="border border-black/10 p-6 hover:border-black/30 transition-colors"
                  data-testid={`project-item-${project.id}`}>
                  <div className="flex gap-6">
                    {/* images strip */}
                    <div className="flex gap-2 shrink-0">
                      <img src={project.image} alt={project.title}
                        className="w-40 h-28 object-cover img-grayscale border border-black/5" />
                      {(project.images || []).slice(0, 2).map((img, i) => (
                        <img key={i} src={img} alt=""
                          className="w-16 h-28 object-cover img-grayscale border border-black/5 hidden md:block" />
                      ))}
                      {(project.images || []).length > 2 && (
                        <div className="w-16 h-28 bg-stone-100 border border-black/5 hidden md:flex items-center justify-center">
                          <span className="text-[9px] text-black/40 uppercase tracking-widest text-center">
                            +{(project.images || []).length - 2}<br/>more
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-serif italic mb-1">{project.title}</h3>
                          <p className="text-[9px] uppercase tracking-widest text-black/40">
                            {project.category} · {project.location} · {project.year}
                          </p>
                          {(project.images || []).length > 0 && (
                            <p className="text-[9px] text-black/30 mt-1 tracking-wide">
                              {(project.images || []).length + 1} images in gallery
                            </p>
                          )}
                        </div>
                        <div className="flex gap-4 shrink-0 ml-4">
                          <button onClick={() => startEdit(project)}
                            className="text-[9px] uppercase tracking-widest text-black/60 hover:text-black transition-colors"
                            data-testid={`edit-project-${project.id}`}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProject(project.id)}
                            className="text-[9px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                            data-testid={`delete-project-${project.id}`}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-black/55 leading-relaxed line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INQUIRIES TAB ── */}
        {activeTab === 'inquiries' && (
          <div>
            <h2 className="text-3xl font-serif italic mb-8">Contact Inquiries</h2>
            {inquiries.length === 0 ? (
              <p className="text-center text-black/40 py-12 text-sm uppercase tracking-widest">No inquiries yet</p>
            ) : (
              <div className="space-y-6">
                {inquiries.map(inquiry => (
                  <div key={inquiry.id}
                    className="border border-black/10 p-8 hover:border-black/30 transition-colors"
                    data-testid={`inquiry-item-${inquiry.id}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{inquiry.name}</h3>
                        <p className="text-sm text-black/60">{inquiry.email}</p>
                        <p className="text-[9px] uppercase tracking-widest text-black/40 mt-2">
                          {new Date(inquiry.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-[9px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                        data-testid={`delete-inquiry-${inquiry.id}`}>
                        Delete
                      </button>
                    </div>
                    <div className="bg-stone-50 p-6 border-l-2 border-black/20">
                      <p className="text-sm leading-relaxed text-black/80">{inquiry.message}</p>
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
