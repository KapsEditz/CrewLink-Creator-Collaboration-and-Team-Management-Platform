import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiClock, FiMessageSquare, FiLoader } from "react-icons/fi";

export default function Overview() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. GET THE USER'S NAME FOR THE GREETING
  const userName = localStorage.getItem("userName") || "Creator";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 2. GET THE TOKEN (This was the missing piece causing the error!)
        const token = localStorage.getItem("token");

        // 3. SEND THE TOKEN TO THE BACKEND IN THE HEADERS
        const response = await fetch("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch projects (Not Authorized)");
        }

        const data = await response.json();
        setProjects(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="overview-page">
      
      <div className="dashboard-greeting">
        {/* DYNAMIC GREETING */}
        <h1>Welcome back, {userName} 👋</h1>
        <p>Here is what's happening across your workspace today.</p>
      </div>

      {/* High-Level Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h4>Active Projects</h4>
            <span className="stat-trend positive">Live Data</span>
          </div>
          <h2>{projects.length}</h2>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <h4>In Review</h4>
            <span className="stat-trend neutral">Needs approval</span>
          </div>
          <h2>3</h2>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <h4>Team Members</h4>
            <span className="stat-trend positive">+1 new</span>
          </div>
          <h2>8</h2>
        </div>
      </div>

      <div className="dashboard-split">
        
        {/* Left Column: Active Projects */}
        <div className="dashboard-card projects-card">
          <div className="card-header">
            <h3>Current Projects</h3>
            <button className="btn-text">View All</button>
          </div>
          
          <div className="project-list">
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <FiLoader className="spin-icon" size={24} />
              </div>
            ) : error ? (
              <div style={{ padding: '1rem', color: '#ef4444' }}>
                Error: {error}
              </div>
            ) : projects.length === 0 ? (
              <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                No active projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div className="project-item" key={project._id || project.title}>
                  <div className="project-info">
                    <h4>{project.title}</h4>
                    <p>Assigned to: {project.assignee}</p>
                  </div>
                  <div className="project-status">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${project.status !== 'neutral' ? project.status : ''}`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="dashboard-card activity-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-icon blue"><FiCheckCircle /></div>
              <div className="activity-details">
                <p><strong>Database</strong> successfully connected to React.</p>
                <span>Just now</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon yellow"><FiClock /></div>
              <div className="activity-details">
                <p><strong>Security</strong> locked down with JWT Auth.</p>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}