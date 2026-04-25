import { useState, useEffect } from 'react';
import { getProjects } from '../api';
import FilterPanel from '../components/FilterPanel';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ProjectMap from '../components/ProjectMap';
import ProjectDashboard from '../components/ProjectDashboard';
import './ProjectsPage.css';

const STATUS_COUNTS = (projects) => ({
  all: projects.length,
  planned: projects.filter(p => p.status === 'planned').length,
  ongoing: projects.filter(p => p.status === 'ongoing').length,
  completed: projects.filter(p => p.status === 'completed').length,
});

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'map'

  const loadProjects = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getProjects(filters);
      setProjects(data.data);
    } catch (e) {
      setError('Failed to load projects. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const counts = STATUS_COUNTS(projects);

  return (
    <div className="projects-page">
      {/* Hero */}
      <div className="projects-hero">
        <div className="container">
          <div className="hero-content fade-up">
            <h1>Development Projects</h1>
            <p className="hero-sub sinhala">ශ්‍රී ලංකාවේ සංවර්ධන ව්‍යාපෘති — සාරාංශය සහ ප්‍රගතිය</p>
          </div>
          <div className="hero-stats fade-up fade-up-1">
            {[
              { label: 'Total', value: counts.all, cls: '' },
              { label: 'Planned', value: counts.planned, cls: 'stat-planned' },
              { label: 'Ongoing', value: counts.ongoing, cls: 'stat-ongoing' },
              { label: 'Completed', value: counts.completed, cls: 'stat-completed' },
            ].map(s => (
              <div key={s.label} className={`hero-stat ${s.cls}`}>
                <span className="stat-num">{s.value}</span>
                <span className="stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container projects-layout">
        {/* Sidebar filter */}
        <aside className="projects-sidebar fade-up fade-up-2">
          <FilterPanel onFilter={loadProjects} />
        </aside>

        {/* Main content */}
        <main className="projects-main fade-up fade-up-3">
          {/* View toggle */}
          <div className="view-toolbar">
            <span className="result-count">
              {loading ? '…' : `${projects.length} project${projects.length !== 1 ? 's' : ''} found`}
            </span>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Grid
              </button>
              <button
                className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
                onClick={() => setView('map')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                Map
              </button>
              <button
                className={`toggle-btn ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => setView('dashboard')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>
                Dashboard
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loader-wrapper">
              <div className="spinner" />
              <span>Loading projects…</span>
            </div>
          ) : view === 'map' ? (
            <ProjectMap projects={projects} onSelect={setSelected} />
          ) : view === 'dashboard' ? (
            <ProjectDashboard projects={projects} />
          ) : projects.length === 0 ? (
            <div className="no-results">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <h3>No projects found</h3>
              <p>Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((p, i) => (
                <div key={p._id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <ProjectCard project={p} onClick={setSelected} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
