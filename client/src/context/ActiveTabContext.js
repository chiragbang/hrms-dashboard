import React, { createContext, useState, useContext } from 'react';

const ActiveTabContext = createContext();

export const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = () => useContext(ActiveTabContext);
