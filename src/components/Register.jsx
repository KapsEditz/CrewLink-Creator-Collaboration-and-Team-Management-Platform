import React, { useState, useEffect } from "react";
// Added useNavigate to push the user to the dashboard after they sign up
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import logoLight from "../../assets/crewlink.png";
import logoDark from "../../assets/crewlink2.png";
import "./login.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // NEW: State for showing errors to the user
  const [error, setError] = useState(null);
  
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate(); // NEW!

// FORCE DARK MODE ON MOUNT
  useEffect(() => {
    document.body.classList.add('dark-theme'); // Forces the CSS to Dark Mode
    document.body.classList.remove('light-theme'); // Strips out the white/grey
    setIsDark(true); // Ensures the white logo loads
  }, []);

// THE NEW, REAL REGISTRATION FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Clear old errors

    // 🔒 YC-LEVEL PASSWORD VALIDATION
    // Must contain: 8+ chars, 1 letter, 1 number, 1 special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include a number and special symbol.");
      return; // Stop the function here so it doesn't hit the backend!
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // SUCCESS! Save the token and their name to the browser
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      
      // Push them straight into the dashboard
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
          <h2>Create an account</h2>
          <p>Join thousands of creators building their dream teams.</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          
          {/* NEW: Error Message Display */}
          {error && <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Aryan Sharma" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>

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
            <div className="label-flex"><label>Password</label></div>
            <input 
              type="password" 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-auth-primary">Sign Up Free</button>
        </form>

        <div className="auth-divider"><span>or sign up with</span></div>

        <div className="social-login">
          <button className="btn-social"><FcGoogle size={20} /> Google</button>
          <button className="btn-social"><FiGithub size={20} /> GitHub</button>
        </div>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
        
      </div>
    </div>
  );
}