'use client';

import React, { useEffect } from 'react';
import 'antd/dist/reset.css'; // Ant Design v5

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import CandidatePage from './pages/CandidatePage';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ActiveTabProvider } from './context/ActiveTabContext';

import './App.css'; // Optional: general layout CSS
import LayoutWrapper from './components/LayoutWrapper';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const elapsed = (new Date() - new Date(loginTime)) / 1000; // seconds
      if (elapsed > 7200) {
        localStorage.clear();
        alert('Session expired. Please login again.');
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <Router>
      <ActiveTabProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes with layout */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                  <DashboardLayout>

                  <Dashboard />
                </DashboardLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/candidates"
            element={
              isAuthenticated ? (
                // <LayoutWrapper>
                <DashboardLayout>

                  <CandidatePage />
                </DashboardLayout>
                // </LayoutWrapper>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </ActiveTabProvider>
    </Router>
  );
}

export default App;
