import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 
import { FiVideo, FiBriefcase, FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("creator");
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [title, setTitle] = useState("");
  const [rate, setRate] = useState("");
  const [skills, setSkills] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const loadingToast = toast.loading("Creating your workspace...");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, title, rate, skills })
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        // Clear previous state remnants
        localStorage.clear();

        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data._id);
        
        toast.success("Workspace created successfully!");
        
        // Full hard navigation reset to clear out role routing cache
        window.location.href = "/dashboard";
      } else {
        toast.error(data.error || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Registration failed. Is the server running?");
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: var(--bg-color); color: var(--text-main); font-family: system-ui, -apple-system, sans-serif; padding: 1rem; }
        .auth-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 3rem; width: 100%; max-width: 520px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .role-card { flex: 1; padding: 1.25rem; border-radius: 12px; border: 2px solid var(--border-color); background: transparent; cursor: pointer; text-align: left; transition: all 0.2s ease; position: relative; }
        .role-card:hover { border-color: rgba(99, 102, 241, 0.4); background: rgba(99, 102, 241, 0.02); }
        .role-card.active { border-color: var(--accent-color, #6366f1); background: rgba(99, 102, 241, 0.05); }
        .input-group { position: relative; margin-bottom: 1.25rem; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: var(--text-muted); font-size: 1.1rem; pointer-events: none; }
        .auth-input { width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; border-radius: 10px; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-main); font-size: 0.95rem; transition: all 0.2s ease; outline: none; }
        .auth-input:focus { border-color: var(--accent-color, #6366f1); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Join CrewLink</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: 0 }}>Create your workspace account.</p>
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>How will you use CrewLink?</label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className={`role-card ${role === "creator" ? "active" : ""}`} onClick={() => setRole("creator")}>
                  <FiVideo size={22} color={role === "creator" ? "#6366f1" : "var(--text-muted)"} style={{ marginBottom: "0.5rem" }} />
                  <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem", color: "var(--text-main)" }}>I'm a Creator</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>Hire talent and manage content.</p>
                  {role === "creator" && <FiCheckCircle style={{ position: "absolute", top: "1rem", right: "1rem", color: "#6366f1" }} />}
                </div>

                <div className={`role-card ${role === "freelancer" ? "active" : ""}`} onClick={() => setRole("freelancer")}>
                  <FiBriefcase size={22} color={role === "freelancer" ? "#6366f1" : "var(--text-muted)"} style={{ marginBottom: "0.5rem" }} />
                  <h3 style={{ fontSize: "0.95rem", marginBottom: "0.25rem", color: "var(--text-main)" }}>I'm a Freelancer</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>Find jobs and get paid.</p>
                  {role === "freelancer" && <FiCheckCircle style={{ position: "absolute", top: "1rem", right: "1rem", color: "#6366f1" }} />}
                </div>
              </div>
            </div>

            <div className="input-group">
              <FiUser className="input-icon" />
              <input type="text" className="auth-input" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            
            <div className="input-group">
              <FiMail className="input-icon" />
              <input type="email" className="auth-input" placeholder="work@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input type="password" className="auth-input" placeholder="Create a strong password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {role === "freelancer" && (
              <div style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px dashed rgba(99, 102, 241, 0.3)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem", animation: "fadeIn 0.3s ease-in-out" }}>
                <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#6366f1", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Freelancer Profile Setup</p>
                
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <input type="text" className="auth-input" style={{ paddingLeft: "1rem" }} placeholder="Title (e.g. Video Editor)" required={role === "freelancer"} value={title} onChange={(e) => setTitle(e.target.value)} />
                  
                  <div style={{ position: "relative", width: "150px" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "700" }}>$</span>
                    <input 
                      type="number" 
                      className="auth-input" 
                      style={{ paddingLeft: "1.8rem", width: "100%" }} 
                      placeholder="Rate/hr" 
                      required={role === "freelancer"} 
                      value={rate} 
                      onChange={(e) => setRate(e.target.value)} 
                    />
                  </div>
                </div>
                
                <input 
                  type="text" 
                  className="auth-input" 
                  style={{ paddingLeft: "1rem" }} 
                  placeholder="Skills (e.g. Premiere Pro, Figma)" 
                  required={role === "freelancer"} 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                />
              </div>
            )}

            <button type="submit" disabled={isLoading} style={{ width: "100%", background: "var(--accent-color, #6366f1)", color: "#fff", border: "none", padding: "0.9rem", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", transition: "all 0.2s", marginTop: "0.5rem", opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? "Creating Account..." : "Create Account"} <FiArrowRight />
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.95rem", color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: "700" }}>Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}