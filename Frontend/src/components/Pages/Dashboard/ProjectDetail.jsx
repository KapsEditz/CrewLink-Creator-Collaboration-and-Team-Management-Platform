import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckSquare, FiCircle, FiCheckCircle, FiUsers, FiTrash2, FiShield, FiAlertCircle } from "react-icons/fi";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const currentUserId = localStorage.getItem("userId");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const projRes = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projData = await projRes.json();
      setProject(projData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTaskTitle })
      });
      setNewTaskTitle("");
      fetchData(); 
    } catch (error) { console.error("Error adding task:", error); }
  };

  const toggleTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
    } catch (error) { console.error("Error toggling task:", error); }
  };

  const handleDeleteTask = async (e, taskId) => {
    e.stopPropagation(); 
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
    } catch (error) { console.error("Error deleting task:", error); }
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm("Are you sure you want to terminate this operation? This cannot be undone.");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/dashboard/projects"); 
    } catch (error) { console.error("Error deleting project:", error); }
  };

  const handleApprove = async (e, applicantId) => {
    e.stopPropagation(); 
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/projects/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicantId })
      });
      fetchData(); 
    } catch (error) { console.error("Error approving applicant:", error); }
  };

  const handleReject = async (e, applicantId) => {
    e.stopPropagation(); 
    const confirmReject = window.confirm("Are you sure you want to decline this clearance?");
    if (!confirmReject) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/projects/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicantId })
      });
      fetchData(); 
    } catch (error) { console.error("Error rejecting applicant:", error); }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: "1.5rem" }}>
        <div className="futuristic-loader"><div className="scanner-line"></div></div>
        <p style={{ color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px" }}>Decrypting Workspace...</p>
        <style>{`
          .futuristic-loader { width: 60px; height: 60px; border: 1px solid var(--border-color); border-radius: 8px; position: relative; overflow: hidden; background: rgba(255,255,255,0.02); }
          .scanner-line { position: absolute; width: 100%; height: 2px; background: var(--accent-color); box-shadow: 0 0 10px var(--accent-color); animation: scan 1.5s ease-in-out infinite alternate; }
          @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        `}</style>
      </div>
    );
  }

  if (!project) return <div style={{ padding: "3rem", color: "#ef4444", textAlign: "center", fontFamily: "ui-monospace, monospace" }}>ERR: PROJECT_NOT_FOUND</div>;

  const isOwner = project.owner && (project.owner._id === currentUserId || project.owner === currentUserId);
  
  // --- UPGRADED PROGRESS LOGIC ---
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const completedTasks = project.tasks ? project.tasks.filter(t => t.isCompleted).length : 0;
  const hasTasks = totalTasks > 0;
  
  const realProgress = hasTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const progressDisplay = hasTasks ? `${realProgress}%` : "STANDBY";
  const isComplete = hasTasks && realProgress === 100;

  return (
    <div className="futuristic-hud" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "1400px", margin: "0 auto", paddingBottom: "1rem" }}>
      
      <style>{`
        .hud-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }
        
        .hud-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--text-muted), transparent); opacity: 0.15;
        }

        .data-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-numeric: tabular-nums;
        }

        /* Fixed Progress Bar Styles */
        .laser-track { 
          width: 100%; 
          height: 4px; 
          background: var(--border-color); 
          position: relative; 
          overflow: hidden; 
          border-radius: 2px;
        }
        .laser-fill { 
          position: absolute; 
          top: 0; 
          left: 0; 
          height: 100%; 
          background: var(--text-main); 
          box-shadow: 0 0 10px var(--text-main); 
          transition: width 0.8s ease; 
        }

        .hud-scroll-area::-webkit-scrollbar { width: 4px; }
        .hud-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .hud-scroll-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .hud-scroll-area::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

        .task-row {
          display: flex; justify-content: space-between; alignItems: center; padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.15s ease;
        }
        .task-row:hover { background: var(--bg-color); }
        .task-row.completed { opacity: 0.5; }

        .crew-card {
          display: flex; justify-content: space-between; alignItems: center; padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.15s ease;
        }
        .crew-card:hover { background: var(--bg-color); }
        
        .btn-outline {
          background: transparent; border: 1px solid var(--border-color); color: var(--text-main);
          padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; display: flex; align-items: center; gap: 0.5rem;
        }
        .btn-outline:hover { background: var(--text-main); color: var(--bg-color); }

        .btn-danger {
          background: transparent; border: 1px solid #ef4444; color: #ef4444;
          padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; display: flex; align-items: center; gap: 0.5rem;
        }
        .btn-danger:hover { background: #ef4444; color: #fff; }
      `}</style>

      {/* HEADER ROW (Fixed) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/dashboard/projects" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid var(--border-color)", color: "var(--text-muted)", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.color="var(--text-main)"} onMouseOut={e=>e.currentTarget.style.color="var(--text-muted)"}>
            <FiArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--text-main)", margin: 0, letterSpacing: "-0.02em" }}>{project.title}</h1>
              <span className="data-mono" style={{ fontSize: "0.7rem", padding: "2px 6px", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-muted)" }}>ID: {project._id.substring(0,6).toUpperCase()}</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiShield size={12} color="var(--accent-color)" /> Authorized by {isOwner ? "You" : project.owner?.name}
            </p>
          </div>
        </div>

        {isOwner && (
          <button onClick={handleDeleteProject} className="btn-danger">
            <FiTrash2 size={14} /> Terminate
          </button>
        )}
      </div>

      {/* OVERALL PROGRESS BAR (Fixed) */}
      <div className="hud-card" style={{ padding: "1.5rem 2rem", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span className="data-mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "1px" }}>OPERATION_PROGRESS</span>
          <span className="data-mono" style={{ fontSize: "1.2rem", fontWeight: "600", color: isComplete ? "var(--success)" : "var(--text-main)" }}>
            {progressDisplay}
          </span>
        </div>
        <div className="laser-track">
          <div className="laser-fill" style={{ width: `${realProgress}%`, background: isComplete ? "var(--success)" : "var(--text-main)", boxShadow: `0 0 10px ${isComplete ? "var(--success)" : "var(--text-main)"}` }}></div>
        </div>
      </div>

      {/* SPLIT PANE: TASKS & PERSONNEL */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem", flex: 1, minHeight: 0 }}>
        
        {/* LEFT PANE: ACTION ITEMS */}
        <div className="hud-card" style={{ height: "100%" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "0.95rem", margin: 0, fontWeight: "600", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiCheckSquare color="var(--accent-color)" /> Action Items
            </h2>
            <span className="data-mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{completedTasks}/{totalTasks} DONE</span>
          </div>

          <div className="hud-scroll-area" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {isOwner && (
              <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)" }}>
                <form onSubmit={handleAddTask} style={{ display: "flex", gap: "1rem" }}>
                  <input type="text" placeholder="Designate new task objective..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: "8px", background: "var(--bg-color)", border: "1px solid var(--border-color)", color: "var(--text-main)", outline: "none", fontSize: "0.9rem", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "var(--text-main)"} onBlur={e => e.target.style.borderColor = "var(--border-color)"} />
                  <button type="submit" className="btn-outline" style={{ background: "var(--text-main)", color: "var(--bg-color)" }}>Add</button>
                </form>
              </div>
            )}

            {/* EXPANDED EMPTY STATE */}
            {(!project.tasks || project.tasks.length === 0) ? (
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)", flexDirection: "column", gap: "1rem", minHeight: "300px" }}>
                <FiCheckSquare size={36} style={{ opacity: 0.3 }} />
                <div style={{ textAlign: "center" }}>
                  <p className="data-mono" style={{ fontSize: "0.95rem", margin: "0 0 0.25rem 0", letterSpacing: "1px" }}>NO_OBJECTIVES_SET</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "inherit" }}>Designate tasks to initiate operation tracking.</p>
                </div>
              </div>
            ) : (
              project.tasks.map(task => (
                <div key={task._id} onClick={() => toggleTask(task._id)} className={`task-row ${task.isCompleted ? 'completed' : ''}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {task.isCompleted ? <FiCheckCircle size={18} color="#22c55e" /> : <FiCircle size={18} color="var(--text-muted)" />}
                    <span style={{ fontSize: "0.95rem", textDecoration: task.isCompleted ? "line-through" : "none", color: "var(--text-main)" }}>{task.title}</span>
                  </div>
                  {isOwner && (
                    <button onClick={(e) => handleDeleteTask(e, task._id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.5rem" }} onMouseOver={e=>e.currentTarget.style.color="#ef4444"} onMouseOut={e=>e.currentTarget.style.color="var(--text-muted)"}>
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: PERSONNEL & APPLICANTS (Max-Height prevents ugly blank stretches) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxHeight: "100%" }}>
          
          {/* PENDING APPLICATIONS */}
          {isOwner && project.applicants && project.applicants.length > 0 && (
            <div className="hud-card" style={{ flexShrink: 0, maxHeight: "50%", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px dashed #eab308", background: "rgba(234, 179, 8, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "0.85rem", margin: 0, fontWeight: "600", color: "#eab308", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiAlertCircle /> Pending Clearances
                </h2>
                <span className="data-mono" style={{ fontSize: "0.75rem", color: "#eab308" }}>{project.applicants.length} REQS</span>
              </div>
              <div className="hud-scroll-area" style={{ overflowY: "auto" }}>
                {project.applicants.map(applicant => (
                  <div key={applicant._id} onClick={() => navigate(`/dashboard/profile/${applicant._id}`)} className="crew-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <img src={applicant.avatar || `https://ui-avatars.com/api/?name=${applicant.name}&background=6366f1&color=fff`} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} alt="avatar"/>
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-main)" }}>{applicant?.name}</div>
                        <div className="data-mono" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{applicant?.title || "UNSPECIFIED_ROLE"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={(e) => handleApprove(e, applicant._id)} style={{ background: "transparent", border: "1px solid #22c55e", color: "#22c55e", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600", cursor: "pointer" }} onMouseOver={e=>{e.currentTarget.style.background="#22c55e"; e.currentTarget.style.color="#fff"}} onMouseOut={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#22c55e"}}>Authorize</button>
                      <button onClick={(e) => handleReject(e, applicant._id)} style={{ background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-muted)", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600", cursor: "pointer" }} onMouseOver={e=>{e.currentTarget.style.borderColor="#ef4444"; e.currentTarget.style.color="#ef4444"}} onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border-color)"; e.currentTarget.style.color="var(--text-muted)"}}>Deny</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE ROSTER */}
          <div className="hud-card" style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "0.95rem", margin: 0, fontWeight: "600", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiUsers color="var(--accent-color)" /> Personnel Roster
              </h2>
              <span className="data-mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{project.crew ? project.crew.length : 0} UNITS</span>
            </div>
            
            <div className="hud-scroll-area" style={{ overflowY: "auto" }}>
              {(!project.crew || project.crew.length === 0) ? (
                <div style={{ padding: "3rem", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)", flexDirection: "column", gap: "0.75rem" }}>
                  <FiUsers size={28} style={{ opacity: 0.3 }} />
                  <p className="data-mono" style={{ fontSize: "0.85rem", margin: 0 }}>ROSTER_EMPTY</p>
                </div>
              ) : (
                project.crew.map(member => (
                  <div key={member._id} onClick={() => navigate(`/dashboard/profile/${member._id}`)} className="crew-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=6366f1&color=fff`} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} alt="avatar"/>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)" }}>{member?.name || "Unknown"}</div>
                        <div className="data-mono" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{member?.title || "ASSIGNED_CREW"}</div>
                      </div>
                    </div>
                    
                    {/* Fixed perfectly aligned ACTIVE badge */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="data-mono" style={{ fontSize: "0.65rem", padding: "4px 8px", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-muted)" }}>ACTIVE</span>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}