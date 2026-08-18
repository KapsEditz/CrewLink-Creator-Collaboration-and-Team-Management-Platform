import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiBriefcase, FiUsers, FiClock, FiCheckCircle, FiTrendingUp, FiArrowRight } from "react-icons/fi";

export default function Overview() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "creator";

  // --- REAL-TIME POLLING LOGIC ---
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch real-time data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: "1.5rem" }}>
        <div className="futuristic-loader">
          <div className="scanner-line"></div>
        </div>
        <p style={{ color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px" }}>Establishing Uplink...</p>
        <style>{`
          .futuristic-loader { width: 60px; height: 60px; border: 1px solid var(--border-color); border-radius: 8px; position: relative; overflow: hidden; background: rgba(255,255,255,0.02); }
          .scanner-line { position: absolute; width: 100%; height: 2px; background: var(--accent-color); box-shadow: 0 0 10px var(--accent-color); animation: scan 1.5s ease-in-out infinite alternate; }
          @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        `}</style>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.progress < 100);
  const completedProjects = projects.filter(p => p.progress === 100);
  const totalCrewHired = projects.reduce((total, p) => total + (p.crew ? p.crew.length : 0), 0);
  const pendingApps = projects.reduce((total, p) => total + (p.applicants ? p.applicants.length : 0), 0);
  const successRate = projects.length > 0 ? Math.round((completedProjects.length / projects.length) * 100) : 100;

  return (
    <div className="futuristic-hud" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "1rem" }}>
      
      <style>{`
        .hud-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        
        .hud-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--text-muted), transparent);
          opacity: 0.15;
        }

        .hud-card:hover {
          border-color: var(--text-muted);
        }

        .data-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-numeric: tabular-nums;
        }

        .radar-dot {
          position: relative;
          width: 8px; height: 8px;
          background: var(--success);
          border-radius: 50%;
        }
        .radar-dot::after {
          content: ''; position: absolute; inset: -4px;
          border: 1px solid var(--success); border-radius: 50%;
          animation: radarPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @keyframes radarPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .laser-track {
          flex: 1; height: 2px; background: var(--border-color); position: relative; overflow: hidden;
        }
        .laser-fill {
          position: absolute; top: 0; left: 0; height: 100%; background: var(--text-main);
          box-shadow: 0 0 8px var(--text-main); transition: width 0.8s ease;
        }

        .hud-scroll-area::-webkit-scrollbar { width: 4px; }
        .hud-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .hud-scroll-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .hud-scroll-area::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}</style>

      {/* ROW 1: HERO MODULE */}
      <div className="hud-card" style={{ padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div className="radar-dot"></div>
            <span className="data-mono" style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px" }}>System Online</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "600", color: "var(--text-main)", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
            Welcome, {userName.split(' ')[0]}.
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: 0, lineHeight: "1.5" }}>
            Telemetry synced. Awaiting your next command.
          </p>
        </div>
        
        {userRole === "creator" && (
          <button 
            onClick={() => navigate('/dashboard/projects')} 
            style={{ 
              background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-color)", 
              padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "500", fontSize: "0.95rem", 
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s"
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--text-main)"; e.currentTarget.style.background = "var(--text-main)"; e.currentTarget.style.color = "var(--bg-color)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-main)"; }}
          >
            Deploy Workspace <FiArrowRight size={16} />
          </button>
        )}
      </div>

      {/* ROW 2: METRICS BENTO BOX (Forced to 3 columns on a single line) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", flexShrink: 0 }}>
        
        <div className="hud-card" style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <FiActivity size={20} />
            <span className="data-mono" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>TRK-01</span>
          </div>
          <div>
            <h3 className="data-mono" style={{ margin: "0 0 0.25rem 0", fontSize: "2.2rem", color: "var(--text-main)", fontWeight: "400" }}>{activeProjects.length}</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Active Projects</p>
          </div>
        </div>

        <div className="hud-card" style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {userRole === 'creator' ? <FiUsers size={20} /> : <FiCheckCircle size={20} />}
            <span className="data-mono" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>TRK-02</span>
          </div>
          <div>
            <h3 className="data-mono" style={{ margin: "0 0 0.25rem 0", fontSize: "2.2rem", color: "var(--text-main)", fontWeight: "400" }}>
              {userRole === 'creator' ? totalCrewHired : completedProjects.length}
            </h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              {userRole === 'creator' ? 'Crew Hired' : 'Completed'}
            </p>
          </div>
        </div>

        <div className="hud-card" style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {userRole === 'creator' ? <FiClock size={20} /> : <FiTrendingUp size={20} />}
            <span className="data-mono" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>TRK-03</span>
          </div>
          <div>
            <h3 className="data-mono" style={{ margin: "0 0 0.25rem 0", fontSize: "2.2rem", color: "var(--text-main)", fontWeight: "400" }}>
              {userRole === 'creator' ? pendingApps : `${successRate}%`}
            </h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              {userRole === 'creator' ? 'Pending Apps' : 'Success Rate'}
            </p>
          </div>
        </div>

      </div>

      {/* ROW 3: DYNAMIC LIST (Forced Minimum Height for Empty State) */}
      <div className="hud-card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "40vh" }}>
        
        {/* List Header */}
        <div style={{ padding: "1.5rem 2.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1rem", margin: 0, fontWeight: "600", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Operations
          </h2>
          <span className="data-mono" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{activeProjects.length} Records</span>
        </div>
        
        {/* List Body */}
        <div className="hud-scroll-area" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {activeProjects.length === 0 ? (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)", flexDirection: "column", gap: "1rem", minHeight: "300px" }}>
              <FiBriefcase size={32} style={{ opacity: 0.5 }} />
              <p className="data-mono" style={{ fontSize: "0.95rem", margin: 0, letterSpacing: "1px" }}>NO_ACTIVE_OPERATIONS</p>
            </div>
          ) : (
            activeProjects.map((project) => (
              <div 
                key={project._id} 
                onClick={() => navigate(`/dashboard/project/${project._id}`)} 
                style={{ 
                  padding: "1.75rem 2.5rem", 
                  borderBottom: "1px solid var(--border-color)", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  cursor: "pointer", 
                  transition: "background 0.15s ease" 
                }}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-color)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.15rem", fontWeight: "600", color: "var(--text-main)" }}>{project.title}</h3>
                  <p className="data-mono" style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {project.tasks ? project.tasks.filter(t => t.isCompleted).length : 0}/{project.tasks ? project.tasks.length : 0} TASKS COMPLETED
                  </p>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "260px" }}>
                  <div className="laser-track">
                    <div className="laser-fill" style={{ width: `${project.progress}%`, background: project.progress === 100 ? "var(--success)" : "var(--text-main)", boxShadow: `0 0 8px ${project.progress === 100 ? "var(--success)" : "var(--text-main)"}` }}></div>
                  </div>
                  <span className="data-mono" style={{ fontSize: "1rem", color: "var(--text-main)", minWidth: "40px", textAlign: "right" }}>
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}