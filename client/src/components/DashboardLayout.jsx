import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <div className="main-content">
      <Header />
      <div className="content-area">{children}</div>
    </div>
  </div>
);

export default DashboardLayout;
