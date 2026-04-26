import { useState, useEffect } from 'react';
import { createProject, updateProject, uploadProjectImage } from '../api';
import { useLocations } from '../hooks/useLocations';
import { parseDMS } from '../utils/coordinates';
import './ProjectForm.css';

const EMPTY = {
  projectName: '', description: '',
  districtId: '', dsDivisionId: '', gnDivisionId: '',
  latitude: '', longitude: '',
  startDate: '', endDate: '', status: 'planned',
  estimatedAmount: '',
  progress: 0,
};

const toDateInput = d => d ? new Date(d).toISOString().split('T')[0] : '';

export default function ProjectForm({ project, onSuccess, onClose }) {
  const isEdit = !!project;
  const [form, setForm] = useState(EMPTY);
  const [dmsInput, setDmsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { districts, dsDivisions, gnDivisions, loadDs, loadGn } = useLocations();

  useEffect(() => {
    if (project) {
      setForm({
        projectName: project.projectName || '',
        description: project.description || '',
        districtId:   project.districtId?._id || project.districtId || '',
        dsDivisionId: project.dsDivisionId?._id || project.dsDivisionId || '',
        gnDivisionId: project.gnDivisionId?._id || project.gnDivisionId || '',
        latitude:  project.latitude ?? '',
        longitude: project.longitude ?? '',
        startDate: toDateInput(project.startDate),
        endDate:   toDateInput(project.endDate),
        status:    project.status || 'planned',
        estimatedAmount: project.estimatedAmount ? project.estimatedAmount / 1000000 : '',
        progress: project.progress || 0,
      });
      if (project.districtId?._id || project.districtId) {
        loadDs(project.districtId?._id || project.districtId).then(() => {
          if (project.dsDivisionId?._id || project.dsDivisionId)
            loadGn(project.dsDivisionId?._id || project.dsDivisionId);
        });
      }
    } else if (districts.length > 0 && !form.districtId) {
      // Auto-select the first district (Monaragala) since this system is exclusive to it
      const defaultD = districts[0];
      setForm(f => ({ ...f, districtId: defaultD._id }));
      loadDs(defaultD._id);
    }
  }, [project, districts]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleDistrict = async e => {
    const v = e.target.value;
    set('districtId', v); set('dsDivisionId', ''); set('gnDivisionId', '');
    await loadDs(v);
  };

  const handleDs = async e => {
    const v = e.target.value;
    set('dsDivisionId', v); set('gnDivisionId', '');
    await loadGn(v);
  };

  const handleDMSChange = e => {
    const val = e.target.value;
    setDmsInput(val);
    if (!val.trim()) return;

    const { lat, lng } = parseDMS(val);
    if (lat !== null && lng !== null) {
      set('latitude', lat);
      set('longitude', lng);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        latitude:  form.latitude  !== '' ? Number(form.latitude)  : null,
        longitude: form.longitude !== '' ? Number(form.longitude) : null,
        estimatedAmount: form.estimatedAmount !== '' ? Number(form.estimatedAmount) * 1000000 : 0,
        progress: Number(form.progress) || 0,
      };
      let result;
      if (isEdit) {
        const { data } = await updateProject(project._id, payload);
        result = data.data;
      } else {
        const { data } = await createProject(payload);
        result = data.data;
      }

      // Handle Image Upload
      if (selectedFile) {
        setLoading(true); // Keep loading while uploading image
        const uploadRes = await uploadProjectImage(result._id, selectedFile);
        result = uploadRes.data.data;
      }

      onSuccess(result, isEdit);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal card fade-up">
        <div className="form-modal-header">
          <h2>{isEdit ? 'Edit Project' : 'New Development Project'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error" style={{ margin: '0 24px' }}>{error}</div>}

        <form className="form-modal-body" onSubmit={handleSubmit}>
          {/* Project Info */}
          <div className="form-section">
            <div className="form-section-title">Project Details</div>
            <div className="form-grid-full">
              <div className="form-group">
                <label className="form-label">Project Name (Sinhala) *</label>
                <input
                  className="form-input sinhala-input"
                  placeholder="ව්‍යාපෘතිය නම"
                  value={form.projectName}
                  onChange={e => set('projectName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Sinhala) *</label>
                <textarea
                  className="form-textarea sinhala-input"
                  placeholder="ව්‍යාපෘතිය විස්තරය..."
                  rows={4}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  required
                />
              </div>
                <label className="form-label">Project Value / මුදල (Rs. Millions)</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 5.5 (for 5.5 Million)"
                  value={form.estimatedAmount}
                  onChange={e => set('estimatedAmount', e.target.value)}
                />
            </div>
          </div>

          {/* Project Photo */}
          <div className="form-section">
            <div className="form-section-title">Project Photo (Optional)</div>
            <div className="form-group">
              <label className="form-label">Upload New Photo</label>
              <input 
                type="file" 
                className="form-input" 
                accept="image/*"
                onChange={e => setSelectedFile(e.target.files[0])}
              />
              <p className="form-tip" style={{fontSize:'0.8rem', color:'#666', marginTop:4}}>
                High quality photos help people understand the project's impact.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <div className="form-section-title">Location Hierarchy</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">DS Division *</label>
                <select className="form-select" value={form.dsDivisionId} onChange={handleDs} required disabled={!form.districtId}>
                  <option value="">Select DS Division</option>
                  {dsDivisions.map(d => (
                    <option key={d._id} value={d._id}>{d.nameSi} ({d.name})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">GN Division *</label>
                <select className="form-select" value={form.gnDivisionId} onChange={e => set('gnDivisionId', e.target.value)} required disabled={!form.dsDivisionId}>
                  <option value="">Select GN Division</option>
                  {gnDivisions.map(g => (
                    <option key={g._id} value={g._id}>{g.nameSi} ({g.name})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="form-section">
            <div className="form-section-title">GPS Coordinates (Optional)</div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="form-label">Paste DMS Format (e.g., 6°43'55.8"N 81°21'21.0"E)</label>
              <input type="text" className="form-input" placeholder='6°43&apos;55.8"N 81°21&apos;21.0"E' value={dmsInput} onChange={handleDMSChange} />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Latitude (Decimal)</label>
                <input type="number" step="any" className="form-input" placeholder="6.8722" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude (Decimal)</label>
                <input type="number" step="any" className="form-input" placeholder="81.3498" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Timeline & Status */}
          <div className="form-section">
            <div className="form-section-title">Timeline & Status</div>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input type="date" className="form-input" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input type="date" className="form-input" value={form.endDate} onChange={e => set('endDate', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Status *</label>
                <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)} required>
                  <option value="planned">Planned / සැලසුම් කළ</option>
                  <option value="ongoing">Ongoing / සිදු වෙමින්</option>
                  <option value="completed">Completed / සම්පූර්ණ</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label className="form-label">Progress Percentage / ප්‍රගතිය: {form.progress}%</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                step="5"
                value={form.progress}
                onChange={e => set('progress', e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-lt)' }}>
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-navy btn-lg" disabled={loading}>
              {loading ? <><div className="spinner" style={{width:16,height:16}} /> Saving…</> : isEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
