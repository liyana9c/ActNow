import React, { useState } from 'react';
import HelpButton from '../components/HelpButton';
import ReportButton from '../components/ReportButton';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const handleHelpClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Send the location data to the backend to send an email
        axios.post('http://localhost:5000/send-help-location', { latitude, longitude })
          .then(response => {
            alert('Help alert sent successfully!');
          })
          .catch(error => {
            alert('Error sending help alert!');
            console.error(error);
          });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>ActNow</h1>
      </header>
      <div className="content">
        <HelpButton onClick={handleHelpClick} />
        <ReportButton />
        <Link to="/admin" className="admin-link">Admin Dashboard</Link>
      </div>
    </div>
  );
};

export default HomePage;
