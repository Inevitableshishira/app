import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Residential", "Commercial"];

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filtered = filter === "All" ? safeProjects : safeProjects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-8 md:px-16">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-14 border-b border-black/5 pb-10 gap-6">
          <h2 className="text-4xl md:text-6xl font-serif italic">Selected Works</h2>
          <div className="flex flex-wrap gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${
                  filter === cat ? "text-black" : "text-black/30 hover:text-black"
                }`}
              >
                {cat}
                {filter === cat && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {loading || filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-black/30 uppercase tracking-widest">Coming Soon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {filtered.map((p, i) => (
              <div key={p.id || i} className="group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative overflow-hidden aspect-[4/3] bg-stone-100 border border-black/5 mb-6">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-black/30">{p.location} — {p.year}</p>
                    <h3 className="text-xl font-serif italic">{p.title}</h3>
                    <p className="text-sm text-black/55 mt-1 leading-relaxed">{p.description}</p>
                  </div>
                  <span className="text-[8px] border border-black/10 px-3 py-1 uppercase tracking-widest text-black/35 shrink-0 ml-4">
                    {p.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
