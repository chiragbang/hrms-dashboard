import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../styles/LayoutWrapper.css'; // optional

const LayoutWrapper = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
