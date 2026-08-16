import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiFolder, FiUsers, FiSettings, FiLogOut, FiMenu, FiBell } from "react-icons/fi";

// Make sure these paths match your assets folder!
import logoLight from "../../../assets/crewlink.png";
import logoDark from "../../../assets/crewlink2.png";
import "./dashboard.css";

export default function DashboardLayout() {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDark(document.body.classList.contains('dark-theme'));
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-theme'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.className = newTheme ? 'dark-theme' : 'light-theme';
  };

const handleLogout = () => {
    // 1. Burn the VIP token and user data!
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    
    // 2. Kick them to the login page
    navigate("/login");
  };

  return (
    <div className="dashboard-app">
      
      {/* 1. THE SIDEBAR (Restored!) */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={isDark ? logoDark : logoLight} alt="CrewLink" className="sidebar-logo" />
          <span className="sidebar-brand">CrewLink</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className="sidebar-link">
            <FiHome /> <span>Overview</span>
          </NavLink>
          <NavLink to="/dashboard/projects" className="sidebar-link">
            <FiFolder /> <span>Projects</span>
          </NavLink>
          <NavLink to="/dashboard/talent" className="sidebar-link">
            <FiUsers /> <span>Talent Directory</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/dashboard/settings" className="sidebar-link">
            <FiSettings /> <span>Settings</span>
          </NavLink>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <FiLogOut /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* 2. THE MAIN CONTENT AREA */}
      <main className="dashboard-main">
        
        {/* THE TOPBAR */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h2 className="page-title">Workspace</h2>
          </div>
          
          <div className="topbar-right">
            
            {/* THEME TOGGLE BUTTON */}
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path><path d="M12 20v2"></path>
                  <path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path>
                  <path d="M2 12h2"></path><path d="M20 12h2"></path>
                  <path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path>
                </svg>
              ) : (
                <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* NOTIFICATION BELL & AVATAR */}
            <button className="notification-btn">
              <FiBell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="user-avatar">AS</div>
            
          </div>
        </header>

        {/* 3. THE OUTLET (Where your pages inject) */}
        <div className="dashboard-content-scroll">
          <div className="dashboard-content-container">
            <Outlet /> 
          </div>
        </div>

      </main>
    </div>
  );
}