import './ProjectCard.css';

const STATUS_LABELS = {
  planned: 'Planned',
  ongoing: 'Ongoing',
  completed: 'Completed',
};

const STATUS_SI = {
  planned: 'සැලසුම් කළ',
  ongoing: 'සිදු වෙමින්',
  completed: 'සම්පූර්ණ',
};

export default function ProjectCard({ project, onClick }) {
  const { projectName, description, status, startDate, endDate, districtId, dsDivisionId, gnDivisionId } = project;

  const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const fmtCurrency = val => val ? `Rs. ${(val/1000000).toFixed(1)}M` : '';

  return (
    <article className="project-card card fade-up" onClick={() => onClick?.(project)}>
      <div className={`project-card-accent status-${status}`} />
      <div className="card-body">
        <div className="project-card-header">
          <span className={`badge badge-${status}`}>
            <span className="badge-dot" />
            {STATUS_LABELS[status]}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {project.estimatedAmount > 0 && (
              <span className="project-card-value">{fmtCurrency(project.estimatedAmount)}</span>
            )}
            <span className="project-card-date">{fmt(startDate)}</span>
          </div>
        </div>

        <h3 className="project-card-title sinhala">{projectName}</h3>
        <p className="project-card-desc">{description}</p>

        <div className="project-card-progress">
          <div className="progress-label">
            <span>Progress</span>
            <span>{project.progress || 0}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className={`progress-bar-fill progress-${status}`} style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>

        <div className="project-card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="sinhala">{gnDivisionId?.nameSi || gnDivisionId?.name}</span>
          <span className="sep">·</span>
          <span className="sinhala">{dsDivisionId?.nameSi || dsDivisionId?.name}</span>
          <span className="sep">·</span>
          <span className="sinhala">{districtId?.nameSi || districtId?.name}</span>
        </div>

        <div className="project-card-timeline">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{fmt(startDate)}</span>
          <span className="arrow">→</span>
          <span>{fmt(endDate)}</span>
        </div>
      </div>
    </article>
  );
}
