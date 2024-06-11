import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './components/LoginPage';
import withAuth from './components/withAuth';


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={React.createElement(withAuth(AdminPage))} />
    </Routes>
  </Router>
);

export default App;
