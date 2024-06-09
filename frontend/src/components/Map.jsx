import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({ onMarkerClick }) => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/incidents')
      .then(response => {
        setIncidents(response.data);
      })
      .catch(error => {
        console.error('Error fetching incidents:', error);
      });
  }, []);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {incidents.map((incident, index) => (
        <Marker
          key={index}
          position={[incident.latitude, incident.longitude]}
          eventHandlers={{ click: () => onMarkerClick(incident) }}
        >
          <Popup>
            <b>{incident.incident}</b><br />
            {incident.details}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
