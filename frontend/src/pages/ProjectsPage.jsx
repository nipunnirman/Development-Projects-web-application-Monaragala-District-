import { useState, useEffect } from 'react';
import { getProjects, getDistricts, getDsDivisions, getGnDivisions } from '../api';
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

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let currentStep = 0;
    const end = parseInt(value, 10) || 0;
    if (end === 0) return setDisplayValue(0);

    const duration = 1200;
    const incrementTime = 30;
    const totalSteps = Math.floor(duration / incrementTime);

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easeOutCube = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutCube * end);
      setDisplayValue(Math.min(currentVal, end));
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue}</>;
};

const STATUS_OPTIONS = [
  { value: '', label: 'සියල්ල' },
  { value: 'planned', label: 'සැලසුම් කළ' },
  { value: 'ongoing', label: 'සිදු වෙමින්' },
  { value: 'completed', label: 'සම්පූර්ණ' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('grid');

  // DS / GN Division filter state
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);
  const [activeDs, setActiveDs] = useState('');
  const [activeGn, setActiveGn] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  // Load Monaragala district + its DS divisions on mount
  useEffect(() => {
    getDistricts().then(r => {
      const districts = r.data.data;
      if (districts.length > 0) {
        getDsDivisions(districts[0]._id).then(res => {
          setDsDivisions(res.data.data);
        });
      }
    });
  }, []);

  const loadProjects = async (ds = activeDs, gn = activeGn, status = activeStatus) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (gn) params.gn = gn;        // GN takes priority
      else if (ds) params.ds = ds;   // else filter by DS
      if (status) params.status = status;
      const { data } = await getProjects(params);
      setProjects(data.data);
    } catch {
      setError('ව්‍යාපෘති පූරණය කළ නොහැකි විය. Backend ධාවනය වන්නේදැයි පරීක්ෂා කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleDsClick = (dsId) => {
    setActiveDs(dsId);
    setActiveGn('');           // clear GN when DS changes
    setGnDivisions([]);
    if (dsId) {
      getGnDivisions(dsId).then(r => setGnDivisions(r.data.data));
    }
    loadProjects(dsId, '', activeStatus);
  };

  const handleGnClick = (gnId) => {
    setActiveGn(gnId);
    loadProjects(activeDs, gnId, activeStatus);
  };

  const handleStatusClick = (status) => {
    setActiveStatus(status);
    loadProjects(activeDs, activeGn, status);
  };

  const counts = STATUS_COUNTS(projects);

  return (
    <div className="projects-page">
      {/* Hero */}
      <div className="projects-hero">
        <div className="container projects-hero-inner">
          <div className="hero-left">
            <div className="hero-content fade-up">
              <h1>Monaragala District Development Projects</h1>
              <p className="hero-sub sinhala">මොණරාගල දිස්ත්‍රික්කයේ සංවර්ධන ව්‍යාපෘති — සාරාංශය සහ ප්‍රගතිය</p>
            </div>
            <div className="hero-stats fade-up fade-up-1">
              {[
                { label: 'සම්පූර්ණ', value: counts.all, cls: '' },
                { label: 'සැලසුම් කළ', value: counts.planned, cls: 'stat-planned' },
                { label: 'සිදු වෙමින්', value: counts.ongoing, cls: 'stat-ongoing' },
                { label: 'නිමවූ', value: counts.completed, cls: 'stat-completed' },
              ].map(s => (
                <div key={s.label} className={`hero-stat ${s.cls}`}>
                  <span className="stat-num"><AnimatedNumber value={s.value} /></span>
                  <span className="stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-right fade-up fade-up-2">
            <img src="/uva-e1708577472866.png" alt="Monaragala / Uva" className="hero-image" />
          </div>
        </div>
      </div>

      {/* DS Division filter buttons */}
      <div className="ds-filter-bar">
        <div className="container">
          <div className="ds-filter-inner">
            <span className="ds-filter-label">ප්‍රාදේශීය ලේකම්</span>
            <div className="ds-buttons">
              <button
                className={`ds-btn ${activeDs === '' ? 'ds-btn-active' : ''}`}
                onClick={() => handleDsClick('')}
              >
                සියල්ල
              </button>
              {dsDivisions.map(ds => (
                <button
                  key={ds._id}
                  className={`ds-btn ${activeDs === ds._id ? 'ds-btn-active' : ''}`}
                  onClick={() => handleDsClick(ds._id)}
                >
                  {ds.nameSi || ds.name}
                </button>
              ))}
            </div>
          </div>

          {/* GN Division scroll buttons — only shown when a DS is selected */}
          {activeDs && gnDivisions.length > 0 && (
            <div className="gn-filter-inner">
              <span className="ds-filter-label">ග්‍රාම නිලධාරී</span>
              <div className="gn-buttons">
                <button
                  className={`gn-btn ${activeGn === '' ? 'gn-btn-active' : ''}`}
                  onClick={() => handleGnClick('')}
                >
                  සියල්ල
                </button>
                {gnDivisions.map(gn => (
                  <button
                    key={gn._id}
                    className={`gn-btn ${activeGn === gn._id ? 'gn-btn-active' : ''}`}
                    onClick={() => handleGnClick(gn._id)}
                  >
                    {gn.nameSi || gn.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status filter pills */}
          <div className="status-filter-inner">
            <span className="ds-filter-label">තත්ත්වය</span>
            <div className="status-pills">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  className={`status-pill status-pill-${s.value || 'all'} ${activeStatus === s.value ? 'status-pill-active' : ''}`}
                  onClick={() => handleStatusClick(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container projects-layout-full">
        {/* View toggle */}
        <div className="view-toolbar">
          <span className="result-count">
            {loading ? '…' : `ව්‍යාපෘති ${projects.length}ක් හමු විය`}
          </span>
          <div className="view-toggle">
            <button className={`toggle-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              ග්‍රිඩ්
            </button>
            <button className={`toggle-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
              සිතියම
            </button>
            <button className={`toggle-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>
              උපකරණ පුවරු
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loader-wrapper">
            <div className="spinner" />
            <span>ව්‍යාපෘති පූරණය වෙමින්…</span>
          </div>
        ) : view === 'map' ? (
          <ProjectMap projects={projects} onSelect={setSelected} />
        ) : view === 'dashboard' ? (
          <ProjectDashboard projects={projects} />
        ) : projects.length === 0 ? (
          <div className="no-results">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <h3>ව්‍යාපෘති හමු නොවීය</h3>
            <p>වෙනත් ප්‍රාදේශීය ලේකම් කොට්ඨාශයක් හෝ තත්ත්වයක් තෝරන්න.</p>
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
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
