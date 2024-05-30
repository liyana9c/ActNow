import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/report')} className="report-button">
      Report Incident
    </button>
  );
};

export default ReportButton;
