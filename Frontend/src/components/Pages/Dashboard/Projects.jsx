import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiFolder, FiX, FiGlobe, FiLock } from "react-icons/fi";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Initializing workspace...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title, isPublic })
      });

      if (response.ok) {
        toast.success("Workspace deployed successfully!", { id: toastId });
        setTitle("");
        setIsPublic(true);
        setIsModalOpen(false);
        fetchProjects(); 
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to initialize workspace", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network uplink failed", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: "1.5rem" }}>
        <div className="futuristic-loader"><div className="scanner-line"></div></div>
        <p style={{ color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px" }}>Accessing Workspaces...</p>
        <style>{`
          .futuristic-loader { width: 60px; height: 60px; border: 1px solid var(--border-color); border-radius: 8px; position: relative; overflow: hidden; background: rgba(255,255,255,0.02); }
          .scanner-line { position: absolute; width: 100%; height: 2px; background: var(--accent-color); box-shadow: 0 0 10px var(--accent-color); animation: scan 1.5s ease-in-out infinite alternate; }
          @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="futuristic-hud" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "1rem" }}>
      
      <style>{`
        /* Card & HUD Styles */
        .hud-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        
        .hud-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--text-muted), transparent); opacity: 0.15;
        }

        .hud-card.interactive:hover {
          border-color: var(--text-muted);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .data-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-numeric: tabular-nums;
        }

        /* Progress Bars */
        .laser-track {
          flex: 1; height: 2px; background: var(--border-color); position: relative; overflow: hidden;
        }
        .laser-fill {
          position: absolute; top: 0; left: 0; height: 100%; background: var(--text-main);
          box-shadow: 0 0 8px var(--text-main); transition: width 0.8s ease;
        }

        /* Scroll Area Fix */
        .hud-scroll-area::-webkit-scrollbar { width: 4px; }
        .hud-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .hud-scroll-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .hud-scroll-area::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

        /* Cascading Animation for Cards */
        .stagger-card {
          opacity: 0;
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Live Status LED */
        .live-led {
          width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: ledBlink 2s infinite;
        }
        @keyframes ledBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Modal Overlays */
        @keyframes modalFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "0.5rem", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "600", color: "var(--text-main)", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
            Workspaces
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
            Manage active operations and deployed crew members.
          </p>
        </div>

        {userRole === "creator" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              background: "var(--text-main)", color: "var(--bg-color)", border: "none", 
              padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", 
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", transition: "opacity 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            <FiPlus size={16} /> Deploy Workspace
          </button>
        )}
      </div>

      {/* PROJECTS GRID (Scrollable Data View) */}
      <div className="hud-scroll-area" style={{ flex: 1, overflowY: "auto", paddingBottom: "2rem", paddingTop: "1rem" }}>
        {projects.length === 0 ? (
          <div className="hud-card stagger-card" style={{ padding: "6rem 2rem", textAlign: "center", border: "1px dashed var(--border-color)", alignItems: "center", justifyContent: "center", gap: "1rem", minHeight: "50vh" }}>
            <div style={{ position: "relative" }}>
              <FiFolder size={48} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
              <div style={{ position: "absolute", inset: 0, background: "var(--accent-color)", filter: "blur(20px)", opacity: 0.1, zIndex: -1 }}></div>
            </div>
            <p className="data-mono" style={{ fontSize: "1rem", margin: 0, letterSpacing: "1px", color: "var(--text-main)" }}>NO_WORKSPACES_FOUND</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>Initialize your first project to begin tracking.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {projects.map((project, index) => (
              <div 
                key={project._id}
                onClick={() => navigate(`/dashboard/project/${project._id}`)}
                className="hud-card interactive stagger-card"
                style={{ cursor: "pointer", padding: "1.75rem", animationDelay: `${index * 0.05}s` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "600", color: "var(--text-main)", lineHeight: "1.4", paddingRight: "1rem" }}>{project.title}</h3>
                  <span className="data-mono" style={{ fontSize: "0.7rem", fontWeight: "600", padding: "4px 8px", borderRadius: "4px", background: project.isPublic ? "rgba(34, 197, 94, 0.1)" : "rgba(100, 116, 139, 0.1)", color: project.isPublic ? "#22c55e" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    {project.isPublic ? <><div className="live-led"></div> PUBLIC</> : <><FiLock size={10}/> PRIVATE</>}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div className="laser-track">
                    <div className="laser-fill" style={{ width: `${project.progress}%`, background: project.progress === 100 ? "var(--success)" : "var(--text-main)", boxShadow: `0 0 8px ${project.progress === 100 ? "var(--success)" : "var(--text-main)"}` }}></div>
                  </div>
                  <span className="data-mono" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", minWidth: "35px", textAlign: "right" }}>
                    {project.progress}%
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1.25rem", borderTop: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Deployed Crew</span>
                    <span className="data-mono" style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{project.crew ? project.crew.length : 0} <span style={{fontSize: "0.75rem", color:"var(--text-muted)"}}>UNITS</span></span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", textAlign: "right" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Pending Apps</span>
                    <span className="data-mono" style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>{project.applicants ? project.applicants.length : 0} <span style={{fontSize: "0.75rem", color:"var(--text-muted)"}}>REQS</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CREATE PROJECT MODAL (Elite Glassmorphism UI) --- */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", animation: "modalFadeIn 0.2s forwards" }}>
          <div className="hud-card" style={{ width: "100%", maxWidth: "480px", padding: "2.5rem", animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e=>e.currentTarget.style.color="var(--text-main)"} onMouseOut={e=>e.currentTarget.style.color="var(--text-muted)"}>
              <FiX size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <div style={{ width: "6px", height: "6px", background: "var(--text-main)", borderRadius: "50%" }}></div>
              <h2 className="data-mono" style={{ fontSize: "0.85rem", fontWeight: "600", margin: 0, letterSpacing: "1px", color: "var(--text-main)" }}>INITIALIZE_WORKSPACE</h2>
            </div>
            
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: "1.5" }}>Configure the parameters for your new operation.</p>

            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Workspace Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q3 Marketing Campaign" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", color: "var(--text-main)", outline: "none", fontSize: "0.95rem", transition: "border-color 0.2s", fontFamily: "inherit" }} 
                  onFocus={e => e.target.style.borderColor = "var(--text-main)"}
                  onBlur={e => e.target.style.borderColor = "var(--border-color)"}
                />
              </div>

              <div 
                style={{ padding: "1rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "flex-start", gap: "1rem", cursor: "pointer", transition: "background 0.2s" }} 
                onClick={() => setIsPublic(!isPublic)}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.01)"}
              >
                <div style={{ marginTop: "2px" }}>
                  <input 
                    type="checkbox" 
                    checked={isPublic} 
                    onChange={(e) => setIsPublic(e.target.checked)} 
                    style={{ width: "16px", height: "16px", accentColor: "var(--text-main)", cursor: "pointer" }} 
                  />
                </div>
                <div>
                  <span style={{ fontWeight: "600", fontSize: "0.95rem", display: "block", color: "var(--text-main)", marginBottom: "0.25rem" }}>Deploy to Global Job Board</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4", display: "block" }}>Allow independent contractors to discover and apply to this workspace.</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "0.85rem", background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem", transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  Abort
                </button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: "0.85rem", background: "var(--text-main)", color: "var(--bg-color)", border: "none", borderRadius: "8px", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "0.9rem", opacity: isSubmitting ? 0.7 : 1, transition: "opacity 0.2s" }}>
                  {isSubmitting ? "Deploying..." : "Launch"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}