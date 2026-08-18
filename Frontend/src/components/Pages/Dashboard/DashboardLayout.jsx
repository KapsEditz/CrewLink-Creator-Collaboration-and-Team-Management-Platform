import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { FiHome, FiFolder, FiUsers, FiSettings, FiLogOut, FiMenu, FiBell, FiSearch, FiCheckCircle } from "react-icons/fi";

import logoLight from "../../../assets/crewlink.png";
import logoDark from "../../../assets/crewlink2.png";
import CommandMenu from "./CommandMenu";
import "./dashboard.css";


export default function DashboardLayout() {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Dynamic notifications state seeded with a clean onboarding alert
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to CrewLink! Your workspace is active.", time: "Just now", read: false }
  ]);

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "creator";
  const userId = localStorage.getItem("userId");
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme Sync Logic
  useEffect(() => {
    setIsDark(document.body.classList.contains('dark-theme'));
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-theme'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch Fresh Avatar strictly for the logged-in User ID
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.avatar) {
            setAvatarUrl(data.avatar);
          } else {
            setAvatarUrl(""); 
          }
        })
        .catch(err => console.error("Avatar fetch error:", err));
    }
  }, [userId]);

  // Fetch real project updates to populate live notifications
  useEffect(() => {
    const fetchLiveNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const projects = await res.json();
          const dynamicNotifs = [];
          
          projects.forEach((proj, index) => {
            if (proj.applicants && proj.applicants.length > 0) {
              dynamicNotifs.push({
                id: `app-${proj._id}`,
                text: `New applicant on "${proj.title}"`,
                time: "Active",
                read: false
              });
            }
          });

          if (dynamicNotifs.length > 0) {
            setNotifications(prev => {
              // Merge without duplicates
              const existingIds = new Set(prev.map(p => p.id));
              const newItems = dynamicNotifs.filter(d => !existingIds.has(d.id));
              return [...newItems, ...prev];
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch live notifications", err);
      }
    };

    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.className = newTheme ? 'dark-theme' : 'light-theme';
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const clearNotifications = () => {
    setNotifications([]);
    setIsNotifOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-app">

      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={isDark ? logoDark : logoLight} alt="CrewLink" className="sidebar-logo" />
          <span className="sidebar-brand">CrewLink</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">Overview</Link>
          {userRole === "creator" && <Link to="/dashboard/projects" className="nav-item">Projects</Link>}
          <Link to="/dashboard/talent" className="nav-item">Talent Directory</Link>
          {userRole === "freelancer" && <Link to="/dashboard/jobs" className="nav-item">Job Board</Link>}
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

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="dashboard-main">

        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h2 className="page-title">Workspace</h2>
          </div>

          <div className="topbar-right">

            {/* COMMAND MENU TRIGGER PILL */}
            <button className="cmd-trigger-btn" onClick={() => setIsCmdOpen(true)}>
              <FiSearch size={14} /> Search workspace... <span className="cmd-kbd">⌘K</span>
            </button>

            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path></svg>
              ) : (
                <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>

            {/* LIVE NOTIFICATION DROPDOWN */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button className="notification-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <FiBell size={20} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>

              {isNotifOpen && (
                <div style={{
                  position: "absolute", top: "130%", right: "0", background: "var(--card-bg)",
                  backdropFilter: "blur(20px)", border: "1px solid var(--border-color)", borderRadius: "16px", width: "340px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)", zIndex: 100, overflow: "hidden",
                  animation: "fadeIn 0.2s ease"
                }}>
                  <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid var(--border-color)", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Notifications</span>
                    <span style={{ fontSize: "0.75rem", background: "var(--accent-light)", color: "var(--accent-color)", padding: "2px 8px", borderRadius: "100px" }}>{notifications.length} Total</span>
                  </div>

                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        You're all caught up!
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", gap: "1rem", cursor: "pointer", transition: "background 0.15s" }} onMouseOver={e => e.currentTarget.style.background = "var(--accent-light)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                          <div style={{ width: "8px", height: "8px", background: "var(--accent-color)", borderRadius: "50%", marginTop: "6px", flexShrink: 0 }}></div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", color: "var(--text-main)", lineHeight: "1.3", fontWeight: "500" }}>{notif.text}</p>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} style={{ width: "100%", padding: "0.85rem", background: "var(--bg-color)", color: "var(--accent-color)", border: "none", borderTop: "1px solid var(--border-color)", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--accent-light)"} onMouseOut={e => e.currentTarget.style.background = "var(--bg-color)"}>
                      Clear all notifications
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* TOP-RIGHT AVATAR */}
            <Link to="/dashboard/settings" title="Edit Profile" style={{ textDecoration: 'none' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-color)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"} />
              ) : (
                <div className="user-avatar" style={{ cursor: "pointer", transition: "transform 0.2s", display: "flex", justifyContent: "center", alignItems: "center" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
                  {userInitials}
                </div>
              )}
            </Link>

          </div>
        </header>

        <div className="dashboard-content-scroll">
          <div className="dashboard-content-container">
            <Outlet />
          </div>
        </div>

      </main>

      {/* COMMAND MENU MODAL */}
      <CommandMenu isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </div>
  );
}