import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import axios from 'axios';

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '80vh',
    latitude: 0,
    longitude: 0,
    zoom: 10,
  });

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const incidentResponse = await axios.get('http://localhost:5000/incidents');
        setIncidents(incidentResponse.data);

        if (incidentResponse.data.length > 0) {
          setViewport((prevViewport) => ({
            ...prevViewport,
            latitude: incidentResponse.data[0].latitude,
            longitude: incidentResponse.data[0].longitude,
          }));
        }
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    const fetchUserLocations = async () => {
      try {
        const locationResponse = await axios.get('http://localhost:5000/user-locations');
        setUserLocations(locationResponse.data);

        if (locationResponse.data.length > 0 && incidents.length === 0) {
          setViewport((prevViewport) => ({
            ...prevViewport,
            latitude: locationResponse.data[0].latitude,
            longitude: locationResponse.data[0].longitude,
          }));
        }
      } catch (error) {
        console.error('Error fetching user locations:', error);
      }
    };

    fetchIncidents();
    fetchUserLocations();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="map-container">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="xxx"
          onViewportChange={(newViewport) => setViewport(newViewport)}
        >
          {incidents.map((incident) => (
            <Marker key={incident._id} latitude={incident.latitude} longitude={incident.longitude}>
              <div style={{ color: 'red' }}>I</div>
            </Marker>
          ))}
          {userLocations.map((location) => (
            <Marker key={location._id} latitude={location.latitude} longitude={location.longitude}>
              <div style={{ color: 'blue' }}>H</div>
            </Marker>
          ))}
        </ReactMapGL>
      </div>
    </div>
  );
};

export default AdminDashboard;
