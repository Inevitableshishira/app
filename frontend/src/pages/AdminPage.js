import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../components/Logo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Residential',
    image: '',
    year: new Date().getFullYear().toString(),
    location: '',
    description: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      if (activeTab === 'projects') {
        const response = await axios.get(`${API}/projects`);
        setProjects(response.data);
      } else if (activeTab === 'inquiries') {
        const response = await axios.get(`${API}/admin/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await axios.post(`${API}/admin/login`, {
        username,
        password
      });
      localStorage.setItem('admin_token', response.data.access_token);
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } catch (error) {
      setLoginError('Invalid credentials');
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');

    try {
      await axios.post(`${API}/admin/projects`, projectForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectForm({
        title: '',
        category: 'Residential',
        image: '',
        year: new Date().getFullYear().toString(),
        location: '',
        description: ''
      });
      setShowProjectForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');

    try {
      await axios.put(`${API}/admin/projects/${editingProject.id}`, projectForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProject(null);
      setProjectForm({
        title: '',
        category: 'Residential',
        image: '',
        year: new Date().getFullYear().toString(),
        location: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      category: project.category,
      image: project.image,
      year: project.year,
      location: project.location,
      description: project.description
    });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setShowProjectForm(false);
    setProjectForm({
      title: '',
      category: 'Residential',
      image: '',
      year: new Date().getFullYear().toString(),
      location: '',
      description: ''
    });
  };

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
              <input
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-black/20"
                required
                data-testid="admin-username-input"
              />
            </div>
            <div className="border-b border-black/20 py-4">
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-[11px] tracking-[0.2em] placeholder:text-black/20"
                required
                data-testid="admin-password-input"
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-[10px] uppercase tracking-widest" data-testid="admin-login-error">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black/90 transition-all"
              data-testid="admin-login-button"
            >
              Access Portal
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">
              ← Back to Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-black/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo color="black" className="scale-75" />
            <span className="text-[10px] uppercase tracking-widest text-black/40">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
            data-testid="admin-logout-button"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex gap-8 mb-12 border-b border-black/10 pb-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`text-[10px] uppercase tracking-[0.3em] pb-2 relative ${
              activeTab === 'projects' ? 'text-black' : 'text-black/40 hover:text-black'
            }`}
            data-testid="tab-projects"
          >
            Projects ({projects.length})
            {activeTab === 'projects' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>}
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`text-[10px] uppercase tracking-[0.3em] pb-2 relative ${
              activeTab === 'inquiries' ? 'text-black' : 'text-black/40 hover:text-black'
            }`}
            data-testid="tab-inquiries"
          >
            Inquiries ({inquiries.length})
            {activeTab === 'inquiries' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>}
          </button>
        </div>

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif italic">Manage Projects</h2>
              {!showProjectForm && !editingProject && (
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-black/90 transition-all"
                  data-testid="add-project-button"
                >
                  + Add Project
                </button>
              )}
            </div>

            {(showProjectForm || editingProject) && (
              <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="mb-12 border border-black/10 p-8 space-y-6" data-testid="project-form">
                <h3 className="text-xl font-serif italic mb-6">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors"
                      required
                      data-testid="project-title-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Category</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors"
                      data-testid="project-category-select"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Urban</option>
                      <option>Interior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Year</label>
                    <input
                      type="text"
                      value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors"
                      required
                      data-testid="project-year-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Location</label>
                    <input
                      type="text"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors"
                      required
                      data-testid="project-location-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className="w-full border-b border-black/20 py-2 outline-none text-sm focus:border-black transition-colors"
                    placeholder="https://images.unsplash.com/..."
                    required
                    data-testid="project-image-input"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-2">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full border border-black/20 p-4 outline-none text-sm focus:border-black transition-colors resize-none"
                    rows="3"
                    required
                    data-testid="project-description-input"
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-black/90 transition-all"
                    data-testid="project-save-button"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border border-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
                    data-testid="project-cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="border border-black/10 p-6 hover:border-black/30 transition-colors" data-testid={`project-item-${project.id}`}>
                  <div className="flex gap-8">
                    <img src={project.image} alt={project.title} className="w-48 h-32 object-cover img-grayscale" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-serif italic mb-2">{project.title}</h3>
                          <p className="text-[9px] uppercase tracking-widest text-black/40">
                            {project.category} • {project.location} • {project.year}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => startEdit(project)}
                            className="text-[9px] uppercase tracking-widest text-black/60 hover:text-black"
                            data-testid={`edit-project-${project.id}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-[9px] uppercase tracking-widest text-red-600 hover:text-red-800"
                            data-testid={`delete-project-${project.id}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-black/60">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div>
            <h2 className="text-3xl font-serif italic mb-8">Contact Inquiries</h2>
            {inquiries.length === 0 ? (
              <p className="text-center text-black/40 py-12 text-sm uppercase tracking-widest">No inquiries yet</p>
            ) : (
              <div className="space-y-6">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border border-black/10 p-8 hover:border-black/30 transition-colors" data-testid={`inquiry-item-${inquiry.id}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{inquiry.name}</h3>
                        <p className="text-sm text-black/60">{inquiry.email}</p>
                        <p className="text-[9px] uppercase tracking-widest text-black/40 mt-2">
                          {new Date(inquiry.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-[9px] uppercase tracking-widest text-red-600 hover:text-red-800"
                        data-testid={`delete-inquiry-${inquiry.id}`}
                      >
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