import React from 'react';
import { useActiveTab } from '../context/ActiveTabContext';
import '../styles/Header.css';

const Header = () => {
  const { activeTab } = useActiveTab();

  return (
    <div className="header">
      <div className="header-title">{activeTab}</div>
      <div className="header-right">
        <input type="text" placeholder="Search..." className="header-search" />
        <span className="header-icon">🔔</span>
        <span className="header-icon">📩</span>
        <img
          src="https://i.pravatar.cc/30"
          alt="profile"
          className="header-profile"
        />
      </div>
    </div>
  );
};

export default Header;
