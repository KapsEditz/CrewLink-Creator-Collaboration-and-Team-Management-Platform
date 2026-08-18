import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // <-- ADDED MISSING TOAST IMPORT
import { FiArrowLeft, FiMail, FiDollarSign, FiStar, FiShield, FiBriefcase, FiCheckCircle } from "react-icons/fi";

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: "1rem" }}>
        <div className="elite-loader"></div>
        <p style={{ color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Loading Profile...</p>
        <style>{`
          .elite-loader { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border-color); border-top-color: var(--text-main); animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!profile) return <div style={{ padding: "3rem", color: "var(--danger)", textAlign: "center", fontFamily: "ui-monospace, monospace" }}>ERR: PROFILE_NOT_FOUND</div>;

  const avatarPreview = profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || 'U'}&background=6366f1&color=fff&size=200`;
  const isCreator = profile.role === "creator";
  
  // Dynamic Variables
  const userStatus = profile.status ? profile.status.toUpperCase() : "AVAILABLE";
  const userRating = profile.rating ? profile.rating.toFixed(1) : "NEW";

  // Upgraded Contact Handler with Clipboard & Mailto
  const handleContact = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(profile.email);
        toast.success(`Copied ${profile.email} to clipboard!`);
      } else {
        toast(`Email: ${profile.email}`, { duration: 6000 });
      }
    } catch (err) {
      toast.error(`Contact email: ${profile.email}`);
    }
    
    window.location.href = `mailto:${profile.email}`;
  };

  return (
    <div className="futuristic-hud" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "1000px", margin: "0 auto", paddingBottom: "1rem" }}>
      
      <style>{`
        .hud-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .hud-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--text-muted), transparent); opacity: 0.15;
        }

        .data-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-numeric: tabular-nums;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr; }
        }

        .btn-outline {
          background: transparent; border: 1px solid var(--text-main); color: var(--text-main);
          padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .btn-outline:hover { background: var(--text-main); color: var(--bg-color); border-color: var(--text-main); }

        .skill-tag {
          font-family: ui-monospace, monospace; font-size: 0.75rem; padding: 6px 12px;
          border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-main);
          background: var(--bg-color);
        }

        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .status-dot.available { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .status-dot.busy { background: #facc15; box-shadow: 0 0 8px #facc15; }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem", transition: "color 0.2s", fontWeight: "500" }} onMouseOver={e=>e.currentTarget.style.color="var(--text-main)"} onMouseOut={e=>e.currentTarget.style.color="var(--text-muted)"}>
          <FiArrowLeft size={16} /> Back to Directory
        </button>
        <span className="data-mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)", border: "1px solid var(--border-color)", padding: "4px 8px", borderRadius: "4px", background: "var(--card-bg)" }}>
          ID: {profile._id.substring(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="profile-grid">
        
        {/* LEFT PANE: IDENTITY & QUICK STATS */}
        <div className="hud-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <img src={avatarPreview} alt={profile.name} style={{ width: "120px", height: "120px", borderRadius: "12px", border: "1px solid var(--border-color)", objectFit: "cover", background: "var(--bg-color)", padding: "4px" }} />
            <div style={{ position: "absolute", bottom: "-4px", right: "-4px", background: "var(--card-bg)", padding: "4px", border: "1px solid var(--border-color)", borderRadius: "50%" }}>
              <div className={`status-dot ${userStatus === 'AVAILABLE' ? 'available' : 'busy'}`}></div>
            </div>
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--text-main)", margin: "0 0 0.25rem 0", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            {profile.name} <FiCheckCircle size={16} color="var(--accent-color)" title="Verified Status" />
          </h1>
          <p className="data-mono" style={{ margin: "0 0 2rem 0", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>
            {isCreator ? "Project Creator" : "Verified Professional"}
          </p>

          <button onClick={handleContact} className="btn-outline" style={{ width: "100%", marginBottom: "2rem" }}>
            <FiMail /> Contact via Email
          </button>

          {/* TELEMETRY MODULE */}
          <div style={{ width: "100%", textAlign: "left", background: "var(--bg-color)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Current Status</span>
              <span className="data-mono" style={{ fontSize: "0.75rem", color: userStatus === 'AVAILABLE' ? "#22c55e" : "#facc15", fontWeight: "600" }}>
                {userStatus}
              </span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Response Time</span>
              <span className="data-mono" style={{ fontSize: "0.8rem", color: "var(--text-main)" }}>~1 HOUR</span>
            </div>

          </div>
        </div>

        {/* RIGHT PANE: OVERVIEW & SPECS */}
        <div className="hud-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div>
            <h2 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              <FiBriefcase color="var(--accent-color)" /> Professional Overview
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--text-main)", margin: 0, fontWeight: "500" }}>
              {profile.title || (isCreator ? "Brand / Agency" : "Independent Specialist")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "8px" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500", marginBottom: "0.5rem" }}>
                {isCreator ? "Platform Role" : "Hourly Rate"}
              </span>
              <span className="data-mono" style={{ fontSize: "1.25rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {isCreator ? "CREATOR" : <><FiDollarSign size={16} color="#22c55e" /> {profile.rate ? String(profile.rate).replace(/[^0-9]/g, '') : "0"}<span style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>/hr</span></>}
              </span>
            </div>
            
            <div style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "8px" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500", marginBottom: "0.5rem" }}>
                {isCreator ? "Platform Rating" : "Client Rating"}
              </span>
              <span className="data-mono" style={{ fontSize: "1.25rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <FiStar size={16} color={userRating === "NEW" ? "var(--text-muted)" : "#eab308"} fill={userRating === "NEW" ? "none" : "#eab308"} /> {userRating}
              </span>
            </div>
          </div>

          {/* Email Context */}
          <div>
             <h2 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              <FiMail color="var(--accent-color)" /> Contact Information
            </h2>
             <p className="data-mono" style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-main)" }}>{profile.email}</p>
          </div>

          {!isCreator && (
            <div>
              <h2 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                <FiShield color="var(--accent-color)" /> Verified Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No skills listed.</span>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}