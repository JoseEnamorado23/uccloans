import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import ConfigModal from '../ConfigModal/ConfigModal';
import TopHeader from '../TopHeader/TopHeader';

import './Dashboard.css';

const Dashboard = () => {
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className={`main-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <TopHeader 
          onConfigClick={() => setMostrarConfig(true)}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="main-content">
          <div className="content-area">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfigModal 
        isOpen={mostrarConfig} 
        onClose={() => setMostrarConfig(false)} 
      />
    </div>
  );
};

export default Dashboard;