import React, { useState } from 'react';
import { LayoutDashboard, FileText, Calendar, Plus, Search } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import NewReport from './pages/NewReport';
import Events from './pages/Events';
import TrackIssue from './pages/TrackIssue';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard userName={userName} />;
      case 'reports':
        return <Reports />;
      case 'new-report':
        return <NewReport />;
      case 'events':
        return <Events />;
      case 'track':
        return <TrackIssue />;
      default:
        return <Dashboard userName={userName} />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">🏛️ CivicPulse</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            <FileText size={20} />
            <span>My Reports</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'track' ? 'active' : ''}`}
            onClick={() => setCurrentPage('track')}
          >
            <Search size={20} />
            <span>Track Issue</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'events' ? 'active' : ''}`}
            onClick={() => setCurrentPage('events')}
          >
            <Calendar size={20} />
            <span>Events</span>
          </button>
        </nav>

        <button 
          className="new-report-btn"
          onClick={() => setCurrentPage('new-report')}
        >
          <Plus size={20} />
          <span>New Report</span>
        </button>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-location">📍 Your location</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;