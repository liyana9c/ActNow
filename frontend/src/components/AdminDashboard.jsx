import React, { useState } from 'react';
import Map from './Map';
import IncidentDetails from './IncidentDetails';

const AdminDashboard = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleMarkerClick = (incident) => {
    setSelectedIncident(incident);
  };

  return (
    <div className="admin-dashboard">
      <div className="map-container">
        <Map onMarkerClick={handleMarkerClick} />
      </div>
      <div className="details-container">
        {selectedIncident ? (
          <IncidentDetails incident={selectedIncident} />
        ) : (
          <p>Click on a marker to see details</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
