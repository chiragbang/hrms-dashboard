"use client"
import React, { useEffect } from 'react';
import 'antd/dist/reset.css'; // For Ant Design v5

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    const elapsed = (new Date() - new Date(loginTime)) / 1000; // seconds
    if (elapsed > 7200) { // 2 hours
      localStorage.clear();
      alert('Session expired. Please login again.');
      window.location.href = '/';
    }
  }
}, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        
        {/* You can add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;
