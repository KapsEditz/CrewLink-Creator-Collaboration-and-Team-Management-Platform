import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiHome, FiFolder, FiUsers, FiBriefcase, FiSettings, FiMoon, FiSun, FiX } from "react-icons/fi";

export default function CommandMenu({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Listen for Cmd+K or Ctrl+K shortcut globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: "overview", label: "Go to Overview", icon: <FiHome />, path: "/dashboard" },
    { id: "projects", label: "Manage Projects", icon: <FiFolder />, path: "/dashboard/projects" },
    { id: "talent", label: "Talent Directory", icon: <FiUsers />, path: "/dashboard/talent" },
    { id: "jobs", label: "Job Board", icon: <FiBriefcase />, path: "/dashboard/jobs" },
    { id: "settings", label: "Account Settings", icon: <FiSettings />, path: "/dashboard/settings" },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "15vh", zIndex: 9999, animation: "fadeIn 0.2s ease" }}>
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "16px", width: "100%", maxWidth: "600px", boxShadow: "0 25px 50px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        
        <div style={{ display: "flex", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", gap: "1rem" }}>
          <FiSearch size={20} color="var(--text-muted)" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: "none", border: "none", color: "var(--text-main)", fontSize: "1.05rem", outline: "none" }}
          />
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><FiX size={18} /></button>
        </div>

        <div style={{ padding: "0.75rem", maxHeight: "350px", overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.95rem" }}>No results found.</div>
          ) : (
            filtered.map((action) => (
              <div 
                key={action.id}
                onClick={() => handleSelect(action.path)}
                style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem", borderRadius: "10px", cursor: "pointer", color: "var(--text-main)", transition: "background 0.15s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "var(--accent-light)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ color: "var(--accent-color)" }}>{action.icon}</span>
                <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{action.label}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: "0.75rem 1.25rem", background: "var(--bg-color)", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>Navigate with arrows or click</span>
          <span>ESC to close</span>
        </div>

      </div>
    </div>
  );
}