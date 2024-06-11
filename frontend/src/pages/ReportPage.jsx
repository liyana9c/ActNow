import React, { useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [incidentType, setIncidentType] = useState('');
  const [incident, setIncident] = useState('');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incidentType || !incident || !details) {
      setMessage('Please fill out all required fields.');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;

        const reportData = {
          incidentType,
          incident,
          details,
          latitude,
          longitude,
          address: '' 
        };

        try {
          const response = await axios.post('http://localhost:5000/report-incident', reportData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setMessage(response.data.message);
        } catch (error) {
          setMessage('Error submitting the report. Please try again.');
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="report-page">
      <header className="header">
        <h1>Report an Incident</h1>
      </header>
      <div className='form_center'>
        <form onSubmit={handleSubmit} className='forms'>
          <div className="form-group">
            <label htmlFor="incidentType">Incident Type</label>
            <select
              id="incidentType"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="Fire">Fire</option>
              <option value="Crime">Crime</option>
              <option value="Medical">Medical</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="incident">Incident Title</label>
            <input
              type="text"
              id="incident"
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="details">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Send Report</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
