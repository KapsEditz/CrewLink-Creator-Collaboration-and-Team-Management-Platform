import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSearch, FiStar, FiUserCheck, FiClock, FiShield } from "react-icons/fi";

export default function TalentDirectory() {
  const [freelancers, setFreelancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchTalent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/freelancers");
      if (res.ok) {
        const data = await res.json();
        setFreelancers(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching talent:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTalent();
  }, []);

  const handleRequestHire = async (e, freelancerId) => {
    e.stopPropagation();
    const toastId = toast.loading("Sending hire request...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/freelancers/${freelancerId}/request`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Hire request sent.", { id: toastId });
        fetchTalent();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send request.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error.", { id: toastId });
    }
  };

  const filteredTalent = freelancers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.title && f.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.skills && f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: "1rem" }}>
        <div className="elite-loader"></div>
        <p style={{ color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Loading Directory...</p>
        <style>{`
          .elite-loader { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border-color); border-top-color: var(--text-main); animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

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
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }

        .data-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-numeric: tabular-nums;
        }

        .hud-scroll-area::-webkit-scrollbar { width: 4px; }
        .hud-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .hud-scroll-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .hud-scroll-area::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

        .stagger-card { opacity: 0; animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .dot-green { background: #22c55e; }
        .dot-amber { background: #eab308; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .search-input-group {
          display: flex; align-items: center; background: var(--bg-color); 
          border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6rem 1rem;
          transition: border-color 0.2s ease; width: 320px;
        }
        .search-input-group:focus-within { border-color: var(--text-main); }
        .search-input {
          background: transparent; border: none; color: var(--text-main); 
          outline: none; margin-left: 0.75rem; width: 100%; font-size: 0.85rem;
        }
        .search-input::placeholder { color: var(--text-muted); }

        .skill-tag {
          font-family: ui-monospace, monospace; font-size: 0.7rem; padding: 4px 8px;
          border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted);
          background: var(--bg-color);
        }

        .btn-hire {
          width: 100%; padding: 0.75rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem;
          cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem;
          transition: all 0.2s ease; border: 1px solid var(--border-color); background: transparent; color: var(--text-main);
        }
        .btn-hire:hover { background: var(--text-main); color: var(--bg-color); border-color: var(--text-main); }

        .btn-pending {
          width: 100%; padding: 0.75rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem;
          display: flex; justify-content: center; align-items: center; gap: 0.5rem; border: 1px dashed var(--border-color);
          background: var(--bg-color); color: var(--text-muted); cursor: not-allowed;
        }
      `}</style>

      {/* HEADER & SEARCH */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "0.5rem", flexShrink: 0, flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-main)", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
            Talent Directory
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
            Discover and hire verified professionals for your workspace.
          </p>
        </div>

        <div className="search-input-group">
          <FiSearch size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            className="search-input"
            placeholder="Search by name, role, or skill..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="hud-scroll-area" style={{ flex: 1, overflowY: "auto", paddingBottom: "2rem", paddingTop: "0.5rem" }}>
        {filteredTalent.length === 0 ? (
          <div className="hud-card stagger-card" style={{ padding: "6rem 2rem", textAlign: "center", border: "1px dashed var(--border-color)", alignItems: "center", justifyContent: "center", gap: "1rem", minHeight: "40vh" }}>
            <FiSearch size={32} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
            <p style={{ fontSize: "1rem", margin: 0, fontWeight: "500", color: "var(--text-main)" }}>No professionals found</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>Try adjusting your search filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filteredTalent.map((talent, index) => {
              const initials = talent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              const isPending = talent.status === "pending";

              return (
                <div 
                  key={talent._id}
                  onClick={() => navigate(`/dashboard/profile/${talent._id}`)}
                  className="hud-card interactive stagger-card"
                  style={{ cursor: "pointer", padding: "1.5rem", animationDelay: `${index * 0.03}s` }}
                >
                  
                  {/* CARD HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    {talent.avatar ? (
                      <img src={talent.avatar} alt={talent.name} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border-color)" }} />
                    ) : (
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "var(--bg-color)", border: "1px solid var(--border-color)", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "1rem" }}>
                        {initials}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--bg-color)" }}>
                      <div className={`status-dot ${isPending ? 'dot-amber' : 'dot-green'}`}></div>
                      <span className="data-mono" style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>
                        {isPending ? 'PENDING' : 'AVAILABLE'}
                      </span>
                    </div>
                  </div>

                  {/* IDENTIFICATION */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "600", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {talent.name} <FiShield size={14} color="var(--accent-color)" />
                    </h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>{talent.title || "Specialist"}</p>
                  </div>

                  {/* DATA */}
                  <div style={{ display: "flex", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.25rem" }}>
                    <div>
                      <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "500", marginBottom: "0.25rem" }}>Rate</span>
                      <span className="data-mono" style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: "500" }}>${talent.rate ? String(talent.rate).replace(/[^0-9]/g, '') : "0"}/hr</span>
                    </div>
                    <div style={{ width: "1px", background: "var(--border-color)" }}></div>
                    <div>
                      <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "500", marginBottom: "0.25rem" }}>Rating</span>
                      <span className="data-mono" style={{ fontSize: "1rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}><FiStar color="#eab308" fill="#eab308" size={12} /> 5.0</span>
                    </div>
                  </div>

                  {/* SKILLS */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.5rem" }}>
                    {talent.skills && talent.skills.length > 0 ? (
                      talent.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag" style={{ opacity: 0.5 }}>Unspecified</span>
                    )}
                    {talent.skills && talent.skills.length > 3 && (
                      <span className="skill-tag">+{talent.skills.length - 3}</span>
                    )}
                  </div>

                  {/* ACTION */}
                  <div style={{ marginTop: "auto" }}>
                    {isPending ? (
                      <button className="btn-pending" disabled>
                        <FiClock size={14} /> Request Pending
                      </button>
                    ) : (
                      <button onClick={(e) => handleRequestHire(e, talent._id)} className="btn-hire">
                        <FiUserCheck size={14} /> Request to Hire
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}