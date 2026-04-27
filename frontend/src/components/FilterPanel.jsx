import { useState, useEffect } from 'react';
import { useLocations } from '../hooks/useLocations';
import './FilterPanel.css';

export default function FilterPanel({ onFilter }) {
  const [district, setDistrict] = useState('');
  const [ds, setDs] = useState('');
  const [gn, setGn] = useState('');
  const [status, setStatus] = useState('');
  const { districts, dsDivisions, gnDivisions, loadDs, loadGn } = useLocations();

  const handleDistrict = async e => {
    const v = e.target.value;
    setDistrict(v); setDs(''); setGn('');
    await loadDs(v);
  };

  const handleDs = async e => {
    const v = e.target.value;
    setDs(v); setGn('');
    await loadGn(v);
  };

  const handleReset = () => {
    setDistrict(''); setDs(''); setGn(''); setStatus('');
    loadDs('');
    onFilter({});
  };

  const handleApply = () => onFilter({ district, ds, gn, status });

  return (
    <div className="filter-panel card">
      <div className="filter-panel-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span>Filter Projects</span>
      </div>

      <div className="filter-body">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">District</label>
          <select className="form-select" value={district} onChange={handleDistrict}>
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d._id} value={d._id}>{d.nameSi} ({d.name})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">DS Division</label>
          <select className="form-select" value={ds} onChange={handleDs} disabled={!district}>
            <option value="">All DS Divisions</option>
            <option value="public">පොදු ව්‍යාපෘති (Public Projects)</option>
            {dsDivisions.map(d => (
              <option key={d._id} value={d._id}>{d.nameSi} ({d.name})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">GN Division</label>
          <select className="form-select" value={gn} onChange={e => setGn(e.target.value)} disabled={!ds}>
            <option value="">All GN Divisions</option>
            {gnDivisions.map(g => (
              <option key={g._id} value={g._id}>{g.nameSi} ({g.name})</option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleApply}>Apply Filters</button>
          <button className="btn btn-outline" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
