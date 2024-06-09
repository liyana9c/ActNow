import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  height: '80vh',
  width: '100%'
};

const center = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194
};

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [userLocations, setUserLocations] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const incidentResponse = await axios.get('http://localhost:5000/incidents');
        setIncidents(incidentResponse.data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    const fetchUserLocations = async () => {
      try {
        const locationResponse = await axios.get('http://localhost:5000/user-locations');
        setUserLocations(locationResponse.data);
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
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
            {incidents.map((incident) => (
              <Marker key={incident._id} position={{ lat: incident.latitude, lng: incident.longitude }} label="I" />
            ))}
            {userLocations.map((location) => (
              <Marker key={location._id} position={{ lat: location.latitude, lng: location.longitude }} label="H" />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default AdminDashboard;
