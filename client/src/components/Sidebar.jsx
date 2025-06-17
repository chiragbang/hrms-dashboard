import React from 'react';
import { FaSignOutAlt, FaChartBar, FaCalendarCheck } from 'react-icons/fa';
import { MdGroups, MdOutlineSupervisorAccount } from 'react-icons/md';
import { useActiveTab } from '../context/ActiveTabContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useActiveTab();
  const navigate = useNavigate();

  const handleNav = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">🟪 LOGO</div>

      <input type="text" placeholder="Search" className="sidebar-search" />

      <div className="sidebar-section">
        <p className="section-title">Recruitment</p>
        <div
          className={`sidebar-item ${activeTab === 'Candidates' ? 'active' : ''}`}
          onClick={() => handleNav('Candidates', '/candidates')}
        >
          <MdOutlineSupervisorAccount />
          <span>Candidates</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Organization</p>
        <div
          className={`sidebar-item ${activeTab === 'Employees' ? 'active' : ''}`}
          onClick={() => handleNav('Employees', '/employees')}
        >
          <MdGroups />
          <span>Employees</span>
        </div>
        <div
          className={`sidebar-item ${activeTab === 'Attendance' ? 'active' : ''}`}
          onClick={() => handleNav('Attendance', '/attendance')}
        >
          <FaChartBar />
          <span>Attendance</span>
        </div>
        <div
          className={`sidebar-item ${activeTab === 'Leaves' ? 'active' : ''}`}
          onClick={() => handleNav('Leaves', '/leaves')}
        >
          <FaCalendarCheck />
          <span>Leaves</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Others</p>
        <div
          className={`sidebar-item ${activeTab === 'Logout' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Logout');
            localStorage.clear();
            navigate('/');
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
