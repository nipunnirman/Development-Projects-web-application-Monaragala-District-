import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, deleteProject, getDistricts, getDsDivisions, getGnDivisions } from '../api';
import ProjectForm from '../components/ProjectForm';
import InfoPopup from '../components/InfoPopup';
import './AdminPage.css';

const STATUS_OPTIONS = [
  { value: '', label: 'සමස්ථ' },
  { value: 'planned', label: 'සැලසුම් කළ' },
  { value: 'ongoing', label: 'ක්රියාත්මක වෙමින්' },
  { value: 'completed', label: 'නිමි' },
];

const STATUS_LABELS = { planned: 'Planned', ongoing: 'Ongoing', completed: 'Completed' };

export default function AdminPage() {
  const { admin } = useAuth();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth <= 768 ? 30 : 50);
  const gnScrollRef = useRef(null);

  const scrollGn = (direction) => {
    if (gnScrollRef.current) {
      gnScrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth <= 768 ? 30 : 50);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtering state
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);
  const [activeDs, setActiveDs] = useState('');
  const [activeGn, setActiveGn] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [showPublicAlert, setShowPublicAlert] = useState(false);

  useEffect(() => {
    if (!admin) { nav('/login'); return; }

    // Initial fetch
    fetchProjects();

    // Load locations
    getDistricts().then(r => {
      const districts = r.data.data;
      if (districts.length > 0) {
        getDsDivisions(districts[0]._id).then(res => {
          setDsDivisions(res.data.data);
        });
      }
    });
  }, [admin]);

  const fetchProjects = async (ds = activeDs, gn = activeGn, status = activeStatus) => {
    setLoading(true);
    setError('');
    setCurrentPage(1); // Reset to page 1 on new fetch
    try {
      const params = {};
      if (gn === 'public') {
        params.scope = 'public';
        if (ds) params.ds = ds;
      } else if (gn) {
        params.gn = gn;
      } else if (ds) {
        params.ds = ds;
      }
      if (status) params.status = status;

      const { data } = await getProjects(params);
      setProjects(data.data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleDsClick = (dsId) => {
    setActiveDs(dsId);
    setActiveGn('');
    setGnDivisions([]);
    if (dsId && dsId !== 'public') {
      getGnDivisions(dsId).then(r => setGnDivisions(r.data.data));
    }
    if (dsId === 'public') {
      setShowPublicAlert(true);
    }
    fetchProjects(dsId, '', activeStatus);
  };

  const handleGnClick = (gnId) => {
    setActiveGn(gnId);
    fetchProjects(activeDs, gnId, activeStatus);
  };

  const handleStatusClick = (status) => {
    setActiveStatus(status);
    fetchProjects(activeDs, activeGn, status);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      flash('Project deleted successfully.');
    } catch { setError('Failed to delete project.'); }
  };

  const flash = msg => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleFormSuccess = (project, isEdit) => {
    if (isEdit) {
      setProjects(prev => prev.map(p => p._id === project._id ? project : p));
    } else {
      setProjects(prev => [project, ...prev]);
    }
    setShowForm(false);
    setEditProject(null);
    flash(isEdit ? 'Project updated!' : 'Project created!');
  };

  const handleEdit = p => { setEditProject(p); setShowForm(true); };

  const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">Welcome, <strong>{admin?.username}</strong> · Manage development projects</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditProject(null); setShowForm(true); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Project
          </button>
        </div>
      </div>

      <div className="container admin-body">
        {error && <div className="alert alert-error   fade-up">{error}</div>}
        {successMsg && <div className="alert alert-success fade-up">{successMsg}</div>}

        {/* Summary stats */}
        <div className="admin-stats fade-up">
          {[
            { label: 'Total', v: projects.length, cls: '' },
            { label: 'Planned', v: projects.filter(p => p.status === 'planned').length, cls: 's-p' },
            { label: 'Ongoing', v: projects.filter(p => p.status === 'ongoing').length, cls: 's-o' },
            { label: 'Completed', v: projects.filter(p => p.status === 'completed').length, cls: 's-c' },
          ].map(s => (
            <div key={s.label} className={`admin-stat-card card ${s.cls}`}>
              <div className="asc-num">{s.v}</div>
              <div className="asc-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="admin-filters-bar card fade-up">
          <div className="ds-filter-inner">
            <span className="ds-filter-label">ප්‍රාදේශීය ලේකම්</span>
            <div className="ds-buttons">
              <button
                className={`ds-btn ${activeDs === 'public' ? 'ds-btn-active' : ''}`}
                onClick={() => handleDsClick('public')}
              >දිස්ත්‍රික්කයේ පොදු</button>
              <button
                className={`ds-btn ${activeDs === '' ? 'ds-btn-active' : ''}`}
                onClick={() => handleDsClick('')}
              >සමස්ථ</button>
              {dsDivisions.map(ds => (
                <button
                  key={ds._id}
                  className={`ds-btn ${activeDs === ds._id ? 'ds-btn-active' : ''}`}
                  onClick={() => handleDsClick(ds._id)}
                >{ds.nameSi || ds.name}</button>
              ))}
            </div>
          </div>

          {activeDs && activeDs !== 'public' && gnDivisions.length > 0 && (
            <div className="gn-filter-inner">
              <span className="ds-filter-label">ග්‍රාම නිලධාරී</span>
              <button className="scroll-arrow-desktop" onClick={() => scrollGn('left')}>&#8249;</button>
              <div className="gn-buttons" ref={gnScrollRef}>
                <button
                  className={`gn-btn ${activeGn === '' ? 'gn-btn-active' : ''}`}
                  onClick={() => handleGnClick('')}
                >සමස්ථ</button>
                <button
                  className={`gn-btn ${activeGn === 'public' ? 'gn-btn-active' : ''}`}
                  onClick={() => handleGnClick('public')}
                >පොදු</button>
                {gnDivisions.map(gn => (
                  <button
                    key={gn._id}
                    className={`gn-btn ${activeGn === gn._id ? 'gn-btn-active' : ''}`}
                    onClick={() => handleGnClick(gn._id)}
                  >{gn.nameSi || gn.name}</button>
                ))}
              </div>
              <button className="scroll-arrow-desktop" onClick={() => scrollGn('right')}>&#8250;</button>
            </div>
          )}

          <div className="status-filter-inner">
            <span className="ds-filter-label">තත්ත්වය</span>
            <div className="status-pills">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  className={`status-pill status-pill-${s.value || 'all'} ${activeStatus === s.value ? 'status-pill-active' : ''}`}
                  onClick={() => handleStatusClick(s.value)}
                >{s.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Project table */}
        <div className="admin-table-wrap card fade-up">
          <div className="admin-table-header">
            <span>Projects</span>
            <span className="table-count">{projects.length} total</span>
          </div>
          {loading ? (
            <div className="loader-wrapper"><div className="spinner" /><span>Loading…</span></div>
          ) : projects.length === 0 ? (
            <div className="no-results" style={{ padding: 48 }}>
              <p>No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>District</th>
                    <th>Status</th>
                    <th>Added By</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProjects.map(p => (
                    <tr key={p._id}>
                        <td className="td-name sinhala">{p.projectName}</td>
                        <td className="sinhala">{p.districtId?.nameSi || '—'}</td>
                        <td><span className={`badge badge-${p.status}`}>{STATUS_LABELS[p.status]}</span></td>
                        <td className="td-creator">
                          <span
                            className="creator-dot"
                            style={{
                              background: (p.createdBy || '').includes('padmalatha') ? '#22c55e' : '#3b82f6',
                            }}
                          />
                          <span className="creator-name">
                            {(p.createdBy || '').includes('padmalatha') ? 'Padmalatha' : 'Mahinda'}
                          </span>
                        </td>
                        <td>{fmt(p.startDate)}</td>
                        <td>{fmt(p.endDate)}</td>
                        <td className="td-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {projects.length > 0 && totalPages > 1 && !loading && (
            <div className="admin-pagination">
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <ProjectForm
          project={editProject}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditProject(null); }}
        />
      )}
      {showPublicAlert && (
        <InfoPopup
          message="ප්‍රතිලාභ එක් කොට්ඨාසයකට පමණක් සීමා නොවන"
          messageEn="Benefits of these projects are not limited to a single division (District-wide Projects)"
          onClose={() => setShowPublicAlert(false)}
        />
      )}
    </div>
  );
}
