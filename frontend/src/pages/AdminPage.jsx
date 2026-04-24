import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, deleteProject } from '../api';
import ProjectForm from '../components/ProjectForm';
import './AdminPage.css';

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

  useEffect(() => {
    if (!admin) { nav('/login'); return; }
    fetchProjects();
  }, [admin]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await getProjects();
      setProjects(data.data);
    } catch { setError('Failed to load projects.'); }
    finally { setLoading(false); }
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

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">Welcome, <strong>{admin?.username}</strong> · Manage development projects</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditProject(null); setShowForm(true); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        </div>
      </div>

      <div className="container admin-body">
        {error   && <div className="alert alert-error   fade-up">{error}</div>}
        {successMsg && <div className="alert alert-success fade-up">{successMsg}</div>}

        {/* Summary stats */}
        <div className="admin-stats fade-up">
          {[
            { label: 'Total', v: projects.length, cls: '' },
            { label: 'Planned',   v: projects.filter(p=>p.status==='planned').length,   cls:'s-p' },
            { label: 'Ongoing',   v: projects.filter(p=>p.status==='ongoing').length,   cls:'s-o' },
            { label: 'Completed', v: projects.filter(p=>p.status==='completed').length, cls:'s-c' },
          ].map(s => (
            <div key={s.label} className={`admin-stat-card card ${s.cls}`}>
              <div className="asc-num">{s.v}</div>
              <div className="asc-lbl">{s.label}</div>
            </div>
          ))}
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
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p._id}>
                      <td className="td-name sinhala">{p.projectName}</td>
                      <td className="sinhala">{p.districtId?.nameSi || '—'}</td>
                      <td><span className={`badge badge-${p.status}`}>{STATUS_LABELS[p.status]}</span></td>
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
    </div>
  );
}
