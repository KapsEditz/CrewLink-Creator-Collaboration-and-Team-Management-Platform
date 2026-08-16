import React, { useState, useEffect } from "react";
// Added useNavigate
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import logoLight from "../../assets/crewlink.png"; 
import logoDark from "../../assets/crewlink2.png"; 
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // NEW: Error state
  const [error, setError] = useState(null);
  
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate(); // NEW!

// FORCE DARK MODE ON MOUNT
  useEffect(() => {
    document.body.classList.add('dark-theme'); // Forces the CSS to Dark Mode
    document.body.classList.remove('light-theme'); // Strips out the white/grey
    setIsDark(true); // Ensures the white logo loads
  }, []);

  // THE NEW, REAL LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // SUCCESS! Save token and push to dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        
        <Link to="/" className="back-link"><FiArrowLeft /> Back to home</Link>

        <div className="auth-header">
          <div className="auth-logo-wrapper">
            <img src={isDark ? logoDark : logoLight} alt="CrewLink" className="auth-logo" />
          </div>
          <h2>Welcome back</h2>
          <p>Enter your details to access your workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          
          {/* NEW: Error Message Display */}
          {error && <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <div className="label-flex">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot?</Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-auth-primary">Sign In</button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="social-login">
          <button className="btn-social"><FcGoogle size={20} /> Google</button>
          <button className="btn-social"><FiGithub size={20} /> GitHub</button>
        </div>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Sign up for free</Link>
        </p>
        
      </div>
    </div>
  );
}