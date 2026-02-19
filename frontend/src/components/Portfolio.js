import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Residential", "Commercial", "Urban"];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);

      // ✅ SAFETY CHECK — Prevent white screen crash
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        console.warn("Projects response is not an array:", response.data);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // fallback safe state
    } finally {
      setLoading(false);
    }
  };

  // ✅ DOUBLE SAFETY CHECK
  const safeProjects = Array.isArray(projects) ? projects : [];

  const filtered =
    filter === "All"
      ? safeProjects
      : safeProjects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-black/5 pb-12 gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-4 block">
              Archive
            </span>
            <h2 className="text-5xl md:text-7xl font-serif italic">
              Selected Works
            </h2>
          </div>

          <div className="flex flex-wrap gap-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${
                  filter === cat
                    ? "text-black"
                    : "text-black/30 hover:text-black"
                }`}
              >
                {cat}
                {filter === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-sm text-black/40 uppercase tracking-widest">
              Loading projects...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-black/40 uppercase tracking-widest">
              No projects found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
            {filtered.map((p, i) => (
              <div
                key={p.id || i}
                className="group animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden aspect-[16/10] bg-stone-100 border border-black/5 mb-8">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-black/30">
                      {p.location} — {p.year}
                    </p>
                    <h3 className="text-2xl font-serif italic">
                      {p.title}
                    </h3>
                    <p className="text-sm text-black/60 mt-2">
                      {p.description}
                    </p>
                  </div>

                  <span className="text-[8px] border border-black/10 px-3 py-1 uppercase tracking-widest text-black/40">
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
