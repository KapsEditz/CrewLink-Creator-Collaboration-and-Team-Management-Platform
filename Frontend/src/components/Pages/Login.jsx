import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import logoLight from "../../assets/crewlink.png"; 
import logoDark from "../../assets/crewlink2.png"; 
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    document.body.classList.add('dark-theme'); 
    document.body.classList.remove('light-theme'); 
    setIsDark(true); 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Verifying credentials...");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        // Clear previous session remnants to prevent stale UI bleed
        localStorage.clear();

        // Save fresh session state
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role); 
        localStorage.setItem("userId", data._id);    
        
        toast.success(`Welcome back, ${data.name}!`);
        
        // Full hard navigation reset to force clean mount of role-based states
        window.location.href = "/dashboard";
      } else {
        toast.error(data.error || "Login failed");
      }

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Is the server running?");
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