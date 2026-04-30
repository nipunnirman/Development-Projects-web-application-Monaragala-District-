import { useEffect, useRef } from 'react';
import './ProjectModal.css';

const STATUS_LABELS = { planned: 'Planned / සැලසුම් කළ', ongoing: 'Ongoing / ක්රියාත්මක වෙමින්', completed: 'Completed / නිමි' };

export default function ProjectModal({ project, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const fmtCurrency = val => val ? `Rs. ${(val / 1000000).toFixed(2)} Million` : 'Not Specified';
  const hasCoords = project.latitude && project.longitude;

  return (
    <div className="modal-overlay" onClick={e => e.target === ref.current && onClose()} ref={ref}>
      <div className="modal-box card fade-up">
        <div className={`modal-stripe status-${project.status}`} />

        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
              <span className={`badge badge-${project.status}`}>{STATUS_LABELS[project.status]}</span>
              {project.scope === 'public' && (
                <span className="badge badge-public">🚣පොදු</span>
              )}
            </div>
            <h2 className="modal-title sinhala">{project.projectName}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {project.images && project.images.length > 0 && (
            <section className="modal-section">
              <div className="modal-image-gallery">
                {project.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Project ${idx + 1}`} className="modal-project-img" />
                ))}
              </div>
            </section>
          )}

          <section className="modal-section">
            <div className="modal-section-label">Description / විස්තරය</div>
            <p className="sinhala modal-desc">{project.description}</p>
          </section>

          <div className="modal-grid">
            <section className="modal-section">
              <div className="modal-section-label">Location / ස්‍ථානය</div>
              {project.scope === 'public' ? (
                <div className="modal-public-divisions">
                  <div className="modal-public-label">🚣 බලපාම් ලද ප්‍රාදේශීය ලේකම් කොට්ඨාශ</div>
                  <div className="modal-affected-tags">
                    {(project.affectedDsDivisions || []).map(d => (
                      <span key={d._id || d} className="affected-tag">{d.nameSi || d.name || d}</span>
                    ))}
                    {(!project.affectedDsDivisions || project.affectedDsDivisions.length === 0) && (
                      <span className="sinhala" style={{ color: 'var(--slate-lt)' }}>--</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="modal-location-row">
                  <div className="modal-loc-item">
                    <span className="loc-label">District</span>
                    <span className="sinhala">{project.districtId?.nameSi} ({project.districtId?.name})</span>
                  </div>
                  <div className="modal-loc-item">
                    <span className="loc-label">DS Division</span>
                    <span className="sinhala">{project.dsDivisionId?.nameSi} ({project.dsDivisionId?.name})</span>
                  </div>
                  <div className="modal-loc-item">
                    <span className="loc-label">GN Division</span>
                    <span className="sinhala">{project.gnDivisionId?.nameSi} ({project.gnDivisionId?.name})</span>
                  </div>
                </div>
              )}
            </section>

            <section className="modal-section">
              <div className="modal-section-label">Timeline / කාලසීමාව</div>
              <div className="modal-timeline">
                <div className="tl-item">
                  <span className="loc-label">Start</span>
                  <span>{fmt(project.startDate)}</span>
                </div>
                <div className="tl-arrow">→</div>
                <div className="tl-item">
                  <span className="loc-label">End</span>
                  <span>{fmt(project.endDate)}</span>
                </div>
              </div>
            </section>

            <section className="modal-section">
              <div className="modal-section-label">Project Value / ප්රතිපාදන මුදල</div>
              <div className="modal-value">
                <span className="value-amount">{fmtCurrency(project.estimatedAmount)}</span>
              </div>
            </section>
          </div>

          <section className="modal-section">
            <div className="modal-section-label">Project Progress / ව්‍යාපෘති ප්‍රගතිය</div>
            <div className="modal-progress-container">
              <div className="modal-progress-bar-bg">
                <div className={`modal-progress-bar-fill progress-${project.status}`} style={{ width: `${project.progress || 0}%` }}>
                  <span className="progress-text">{project.progress || 0}%</span>
                </div>
              </div>
            </div>
          </section>

          {hasCoords && (
            <section className="modal-section">
              <div className="modal-section-label">Coordinates</div>
              <div className="modal-coords">
                <span>🌐 {project.latitude?.toFixed(5)}, {project.longitude?.toFixed(5)}</span>
                <a
                  className="btn btn-outline btn-sm"
                  href={`https://maps.google.com/?q=${project.latitude},${project.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
