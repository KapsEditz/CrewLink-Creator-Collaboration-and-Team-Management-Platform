import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSave, FiUser, FiBriefcase, FiDollarSign, FiStar, FiMail, FiImage, FiVideo, FiActivity } from "react-icons/fi";

export default function Settings() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [title, setTitle] = useState(""); 
    const [rate, setRate] = useState("");
    const [skills, setSkills] = useState("");
    const [avatar, setAvatar] = useState(""); 
    const [status, setStatus] = useState("Available"); // NEW: Status State
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const userRole = localStorage.getItem("userRole") || "creator";
    const userId = localStorage.getItem("userId");
    
    const avatarPreview = avatar || `https://ui-avatars.com/api/?name=${name || 'U'}&background=6366f1&color=fff&size=150`;

    useEffect(() => {
        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setName(data.name || "");
                setEmail(data.email || "");
                setTitle(data.title || "");
                setAvatar(data.avatar || "");
                setRate(data.rate ? String(data.rate).replace(/[^0-9]/g, '') : "");
                setSkills(data.skills ? data.skills.join(", ") : "");
                setStatus(data.status || "Available");
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load telemetry data.");
                setIsLoading(false);
            });
    }, [userId]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const toastId = toast.loading("Updating configurations...");

        try {
            const token = localStorage.getItem("token");
            
            const payload = { name, avatar, title, status };
            
            if (userRole === "freelancer") {
                payload.rate = rate;
                payload.skills = skills;
            }

            const response = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("userName", data.user.name); 
                if (data.user.avatar) {
                    localStorage.setItem("userAvatar", data.user.avatar);
                }
                
                toast.success("Configurations saved successfully.", { id: toastId });
                setTimeout(() => window.location.reload(), 1000); 
            } else {
                toast.error(data.error || "Failed to update settings.", { id: toastId });
            }
        } catch (err) {
            toast.error("Network error. Uplink failed.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: "1.5rem" }}>
          <div className="futuristic-loader"><div className="scanner-line"></div></div>
          <p style={{ color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px" }}>Accessing Configs...</p>
          <style>{`
            .futuristic-loader { width: 60px; height: 60px; border: 1px solid var(--border-color); border-radius: 8px; position: relative; overflow: hidden; background: rgba(255,255,255,0.02); }
            .scanner-line { position: absolute; width: 100%; height: 2px; background: var(--accent-color); box-shadow: 0 0 10px var(--accent-color); animation: scan 1.5s ease-in-out infinite alternate; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
          `}</style>
        </div>
      );
    }

    return (
        <div className="futuristic-hud" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "0 auto", paddingBottom: "1rem" }}>
            
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

                .hud-scroll-area::-webkit-scrollbar { width: 4px; }
                .hud-scroll-area::-webkit-scrollbar-track { background: transparent; }
                .hud-scroll-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
                .hud-scroll-area::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

                .input-hud {
                    width: 100%; padding: 0.8rem 1rem; border-radius: 8px; 
                    background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); 
                    color: var(--text-main); outline: none; font-size: 0.95rem; 
                    transition: border-color 0.2s; font-family: inherit;
                }
                .input-hud:focus { border-color: var(--text-main); }
                .input-hud:disabled { background: rgba(0,0,0,0.05); color: var(--text-muted); cursor: not-allowed; }

                .hud-label {
                    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; 
                    color: var(--text-muted); font-size: 0.75rem; font-weight: 600; 
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
            `}</style>

            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "0.5rem", flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-main)", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
                        Configurations
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
                        Manage your identity and telemetry parameters.
                    </p>
                </div>
            </div>
            
            <div className="hud-scroll-area" style={{ flex: 1, overflowY: "auto", paddingBottom: "2rem", paddingTop: "0.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* CARD 1: IDENTITY */}
                  <div className="hud-card" style={{ padding: "2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border-color)" }}>
                          <img src={avatarPreview} alt="Profile" style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover", border: "1px solid var(--border-color)", padding: "2px" }} />
                          <div style={{ flex: 1 }}>
                              <label className="hud-label"><FiImage /> Avatar Link</label>
                              <input 
                                  type="text" 
                                  className="input-hud"
                                  value={avatar} 
                                  onChange={e => setAvatar(e.target.value)} 
                                  placeholder="Paste an image URL..."
                              />
                          </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                          <div>
                              <label className="hud-label"><FiUser /> Full Name</label>
                              <input type="text" className="input-hud" value={name} onChange={e => setName(e.target.value)} required />
                          </div>
                          <div>
                              <label className="hud-label"><FiMail /> Linked Email</label>
                              <input type="email" className="input-hud" value={email} disabled />
                          </div>
                      </div>
                  </div>

                  {/* CARD 2: STATUS & ROLE */}
                  <div className="hud-card" style={{ padding: "2rem" }}>
                      <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "1px" }}>
                          <FiActivity color="var(--accent-color)" /> Operational Status
                      </h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                          <div>
                              <label className="hud-label">Current Status</label>
                              <select className="input-hud" value={status} onChange={(e) => setStatus(e.target.value)}>
                                  <option value="Available">🟢 Available</option>
                                  <option value="Busy">🟡 Busy</option>
                                  <option value="Do Not Disturb">🔴 Do Not Disturb</option>
                              </select>
                          </div>
                          <div>
                              <label className="hud-label">Designation / Title</label>
                              <input type="text" className="input-hud" value={title} onChange={e => setTitle(e.target.value)} placeholder={userRole === "creator" ? "Brand / Agency Name" : "Specialist Title"} required />
                          </div>
                      </div>
                  </div>

                  {/* CARD 3: FREELANCER METRICS */}
                  {userRole === "freelancer" && (
                      <div className="hud-card" style={{ padding: "2rem" }}>
                          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "1px" }}>
                              <FiBriefcase color="var(--accent-color)" /> Telemetry Specs
                          </h3>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                              <div>
                                  <label className="hud-label">Hourly Rate</label>
                                  <div style={{ position: "relative" }}>
                                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "700" }}><FiDollarSign /></span>
                                      <input type="number" className="input-hud data-mono" style={{ paddingLeft: "2.2rem" }} value={rate} onChange={e => setRate(e.target.value)} required />
                                  </div>
                              </div>
                              <div>
                                  <label className="hud-label"><FiStar /> Skill Arsenal</label>
                                  <input type="text" className="input-hud data-mono" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, Video Editing..." required />
                              </div>
                          </div>
                      </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button type="submit" disabled={isSaving} style={{ background: "var(--text-main)", color: "var(--bg-color)", border: "none", padding: "0.85rem 2rem", borderRadius: "8px", fontWeight: "600", cursor: isSaving ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", opacity: isSaving ? 0.7 : 1, transition: "opacity 0.2s" }}>
                          <FiSave /> {isSaving ? "TRANSMITTING..." : "SAVE CONFIGS"}
                      </button>
                  </div>
              </form>
            </div>
        </div>
    );
}