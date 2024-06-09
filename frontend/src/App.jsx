import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import AdminDashboard from './components/AdminDashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </Router>
);

export default App;
