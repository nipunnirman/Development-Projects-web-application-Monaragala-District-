import { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ProjectDashboard.css';

const COLORS = ['#8B6D2A', '#D97706', '#059669', '#2563EB', '#1A7A5E', '#C9A84C'];
const STATUS_COLORS = {
  planned: '#2563EB',
  ongoing: '#D97706',
  completed: '#059669'
};

export default function ProjectDashboard({ projects }) {
  const [groupBy, setGroupBy] = useState('ds'); // 'ds' or 'gn'
  const [drillDownDS, setDrillDownDS] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null); // { type: 'area'|'status', value: string, label: string }

  const dsColorMap = useMemo(() => {
    const map = {};
    let idx = 0;
    projects.forEach(p => {
      const dsName = p.dsDivisionId?.name || p.dsDivisionId?.nameSi || 'පොදු ව්‍යාපෘති (Public Projects)';
      if (!map[dsName]) {
        map[dsName] = COLORS[idx % COLORS.length];
        idx++;
      }
    });
    return map;
  }, [projects]);

  const displayedProjects = useMemo(() => {
    if (!drillDownDS) return projects;
    return projects.filter(p => {
      const dsName = p.dsDivisionId?.name || p.dsDivisionId?.nameSi;
      return dsName === drillDownDS;
    });
  }, [projects, drillDownDS]);

  const { statusData, areaData } = useMemo(() => {
    const statusCount = { planned: 0, ongoing: 0, completed: 0 };
    displayedProjects.forEach(p => {
      if (statusCount[p.status] !== undefined) statusCount[p.status]++;
    });
    
    const statusData = [
      { name: 'Planned', value: statusCount.planned, fill: STATUS_COLORS.planned },
      { name: 'Ongoing', value: statusCount.ongoing, fill: STATUS_COLORS.ongoing },
      { name: 'Completed', value: statusCount.completed, fill: STATUS_COLORS.completed },
    ].filter(d => d.value > 0);

    const areaMap = {};
    displayedProjects.forEach(p => {
      const areaObj = groupBy === 'ds' ? p.dsDivisionId : p.gnDivisionId;
      const areaName = areaObj?.name || areaObj?.nameSi || 'පොදු ව්‍යාපෘති (Public Projects)';
      const parentDS = p.dsDivisionId?.name || p.dsDivisionId?.nameSi || 'පොදු ව්‍යාපෘති (Public Projects)';
      
      if (!areaMap[areaName]) {
        areaMap[areaName] = { name: areaName, count: 0, value: 0, parentDS };
      }
      areaMap[areaName].count += 1;
      areaMap[areaName].value += (p.estimatedAmount || 0);
    });

    let areaData = Object.values(areaMap).sort((a, b) => b.count - a.count);
    
    if (areaData.length > 15) {
      const top15 = areaData.slice(0, 15);
      const others = areaData.slice(15).reduce((acc, curr) => ({
        name: 'Other Areas',
        count: acc.count + curr.count,
        value: acc.value + curr.value
      }), { name: 'Other Areas', count: 0, value: 0 });
      areaData = [...top15, others];
    }

    return { statusData, areaData };
  }, [displayedProjects, groupBy]);

  const selectedProjects = useMemo(() => {
    if (!selectedFilter) return [];
    
    if (selectedFilter.type === 'area') {
      if (selectedFilter.value === 'Other Areas') return [];
      return displayedProjects.filter(p => {
        const areaObj = groupBy === 'ds' ? p.dsDivisionId : p.gnDivisionId;
        const areaName = areaObj?.name || areaObj?.nameSi || 'පොදු ව්‍යාපෘති (Public Projects)';
        return areaName === selectedFilter.value;
      });
    } else if (selectedFilter.type === 'status') {
      return displayedProjects.filter(p => p.status === selectedFilter.value);
    }
    return [];
  }, [displayedProjects, selectedFilter, groupBy]);

  const handleToggleGroupBy = (mode) => {
    setGroupBy(mode);
    if (mode === 'ds') {
      setDrillDownDS(null);
    }
    setSelectedFilter(null);
  };

  const handleAreaClick = (data) => {
    const name = data?.name || data?.payload?.name;
    if (!name || name === 'Other Areas') return;

    if (groupBy === 'ds') {
      // Drill down into this DS division's GN divisions
      setDrillDownDS(name);
      setGroupBy('gn');
      setSelectedFilter(null);
    } else {
      // We are in GN division view, show projects for this GN
      setSelectedFilter(prev => 
        (prev?.type === 'area' && prev?.value === name) 
          ? null 
          : { type: 'area', value: name, label: name }
      );
    }
  };

  const handleStatusClick = (data) => {
    const name = data?.name || data?.payload?.name;
    if (!name) return;
    
    const rawStatus = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k] === name) || name.toLowerCase();
    setSelectedFilter(prev => 
      (prev?.type === 'status' && prev?.value === rawStatus) 
        ? null 
        : { type: 'status', value: rawStatus, label: name }
    );
  };

  const fmtValue = val => `Rs. ${(val / 1000000).toFixed(1)}M`;
  const fmtValueTooltip = val => `Rs. ${(val / 1000000).toFixed(2)} Million`;

  if (!projects || projects.length === 0) {
    return (
      <div className="dashboard-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
        <h3>No Data to Visualize</h3>
        <p>Try adjusting your sidebar filters to load projects.</p>
      </div>
    );
  }

  return (
    <div className="project-dashboard fade-up">
      <div className="dashboard-header">
        <h2>
          Analytics Overview 
          {drillDownDS && <span className="drilldown-label"> › {drillDownDS} Division</span>}
        </h2>
        <div className="dashboard-controls">
          <span className="control-label">Group By:</span>
          <div className="toggle-group">
            <button 
              className={`toggle-option ${groupBy === 'ds' ? 'active' : ''}`}
              onClick={() => handleToggleGroupBy('ds')}
            >DS Division</button>
            <button 
              className={`toggle-option ${groupBy === 'gn' ? 'active' : ''}`}
              onClick={() => handleToggleGroupBy('gn')}
            >GN Division</button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3 className="chart-title">Project Status Distribution</h3>
          <div className="chart-container pie-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  onClick={handleStatusClick}
                  style={{ cursor: 'pointer' }}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      opacity={(selectedFilter?.type === 'status' && selectedFilter.label === entry.name) ? 1 : (selectedFilter ? 0.4 : 1)}
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [value, 'Projects']} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">
            Projects by {groupBy === 'ds' ? 'DS Definition' : 'GN Definition'}
            <span className="chart-hint">(Click a slice to drill down/view)</span>
          </h3>
          <div className="chart-container pie-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={areaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({name, value}) => `${name} (${value})`}
                  labelLine={false}
                  onClick={handleAreaClick}
                  style={{ cursor: 'pointer' }}
                >
                  {areaData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={dsColorMap[entry.parentDS] || COLORS[index % COLORS.length]} 
                      opacity={(selectedFilter?.type === 'area' && selectedFilter.label === entry.name) ? 1 : (selectedFilter ? 0.4 : 1)}
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [value, 'Projects']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {selectedFilter && (
          <div className="chart-card full-width fade-up">
            <div className="selected-area-header">
              <h3 className="chart-title">
                {selectedFilter.type === 'area' 
                  ? `Projects in ${selectedFilter.label}`
                  : `Projects marked as ${selectedFilter.label}`}
              </h3>
              <button className="close-btn" onClick={() => setSelectedFilter(null)}>✕</button>
            </div>
            <div className="project-titles-list">
              {selectedProjects.map(p => (
                <div key={p._id} className="project-title-item">
                  <span className={`status-dot status-${p.status}`}></span>
                  <span className="sinhala">{p.projectName}</span>
                  {p.estimatedAmount > 0 && <span className="project-amount-badge">{fmtValue(p.estimatedAmount)}</span>}
                </div>
              ))}
              {selectedProjects.length === 0 && <p className="no-projects-hint">No projects found matching this selection.</p>}
            </div>
          </div>
        )}

        <div className="chart-card full-width">
          <h3 className="chart-title">Project Values by {groupBy === 'ds' ? 'DS Definition' : 'GN Definition'}</h3>
          <div className="chart-container bar-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={areaData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{fill: '#4A5568', fontSize: 12}} 
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tickFormatter={fmtValue}
                  tick={{fill: '#4A5568', fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip 
                  formatter={(value) => [fmtValueTooltip(value), 'Total Value']}
                  cursor={{fill: '#F1F5F9'}} 
                />
                <Bar dataKey="value" fill="#8B6D2A" radius={[4, 4, 0, 0]}>
                  {areaData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={dsColorMap[entry.parentDS] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
