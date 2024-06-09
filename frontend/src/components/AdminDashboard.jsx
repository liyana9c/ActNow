import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null); // State to track the selected incident
  const [viewport, setViewport] = useState({
    width: '80%',
    height: '800px',
    latitude: 11.004556,
    longitude: 76.961632,
    zoom: 8,
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

  const handleMarkerClick = (incident) => {
    console.log('Marker clicked:', incident); // Debug: log the clicked marker
    setSelectedIncident(incident);
  };

  const closeSideTab = () => {
    setSelectedIncident(null);
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="content">
        <div className="map-container">
          <Map
            mapboxAccessToken='xxx'
            style={{
              width: '100%',
              height: '800px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
            initialViewState={viewport}
            mapStyle={'mapbox://styles/mapbox/streets-v11'}
            onViewportChange={(newViewport) => setViewport(newViewport)}
          >
            {incidents.map((incident) => (
              <Marker key={incident._id} latitude={incident.latitude} longitude={incident.longitude}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMarkerClick(incident)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="blue" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
              </Marker>
            ))}
            {userLocations.map((location) => (
              <Marker key={location._id} latitude={location.latitude} longitude={location.longitude}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMarkerClick(location)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="red" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
              </Marker>
            ))}
          </Map>
        </div>
        {selectedIncident && (
          <div className="side-tab">
            <div className='close' onClick={closeSideTab}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></div>
            
            <h2>Incident Details</h2>
            <p><strong>Latitude:</strong> {selectedIncident.latitude}</p>
            <p><strong>Longitude:</strong> {selectedIncident.longitude}</p>
            {selectedIncident.incident ? (
              <>
                <p><strong>Type:</strong> {selectedIncident.incident}</p>
                <p><strong>Description:</strong> {selectedIncident.details}</p>
                <p><strong>Address:</strong> {selectedIncident.address}</p>
              </>
            ) : (
              <p className='Help'><strong>A HELP ALERT!!</strong></p>
            )}
            <button>Assign to Responder</button>
            <button>View Response Progress</button>
            <button>Communicate with Responder</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
