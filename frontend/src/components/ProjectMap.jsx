import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ProjectMap.css';

// Fix leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusColors = {
  planned: '#2563EB',
  ongoing: '#D97706',
  completed: '#059669',
};

const makeIcon = status => L.divIcon({
  className: '',
  html: `<div class="map-marker" style="background:${statusColors[status] || '#888'}"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function ProjectMap({ projects, onSelect }) {
  const withCoords = projects.filter(p => p.latitude && p.longitude);

  if (withCoords.length === 0) {
    return (
      <div className="map-empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <p>No projects with coordinates to show on map.</p>
      </div>
    );
  }

  const center = [
    withCoords.reduce((s, p) => s + p.latitude, 0) / withCoords.length,
    withCoords.reduce((s, p) => s + p.longitude, 0) / withCoords.length,
  ];

  return (
    <div className="map-wrapper">
      <MapContainer center={center} zoom={9} className="leaflet-map" scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        {withCoords.map(p => (
          <Marker
            key={p._id}
            position={[p.latitude, p.longitude]}
            icon={makeIcon(p.status)}
            eventHandlers={{ click: () => onSelect?.(p) }}
          >
            <Popup>
              <div className="map-popup sinhala">
                <strong>{p.projectName}</strong>
                <span className={`badge badge-${p.status}`} style={{ marginTop: 4 }}>{p.status}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
