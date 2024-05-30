import React, { useState } from 'react';
import axios from 'axios';


const ReportPage = () => {
  const [incident, setIncident] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incident || !details) {
      setMessage('Please fill out all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('incident', incident);
    formData.append('details', details);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/report-incident', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error submitting the report. Please try again.');
    }
  };

  return (
    <div className="report-page">
      <h1>Report Incident</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label htmlFor="file">Attach Image (Optional)</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="submit-button">Send Report</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ReportPage;
