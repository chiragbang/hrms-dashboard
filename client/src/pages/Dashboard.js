import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={() => {
        localStorage.clear();
        window.location.href = '/';
      }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
