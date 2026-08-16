import React, { useState, useEffect } from "react";
import { FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

// 1. Import BOTH logos
import logoLight from "../../assets/crewlink.png";
import logoDark from "../../assets/crewlink2.png";

import "./footer.css";

export default function Footer() {
  // 2. State to track the theme for the logo swap
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial load
    setIsDark(document.body.classList.contains('dark-theme'));
    
    // Listen for changes from the Navbar button
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-theme'));
    });
    
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-top">
          
          <div className="footer-about">
            <div className="footer-brand">
              {/* 3. Swap the logo here! */}
              <img src={isDark ? logoDark : logoLight} alt="CrewLink" className="footer-logo" />
              <h2>CrewLink</h2>
            </div>
            <p>
              Find talented creators, build powerful teams, and manage creative projects from one unified platform.
            </p>
          </div>

          <div className="footer-links-wrapper">
            <div className="footer-links-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#projects">Projects</a>
              <a href="#dashboard">Dashboard</a>
              <a href="#pricing">Pricing</a>
            </div>

            <div className="footer-links-col">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
              <a href="#blog">Blog</a>
            </div>

            <div className="footer-links-col">
              <h4>Resources</h4>
              <a href="#help">Help Center</a>
              <a href="#community">Community</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms</a>
            </div>
          </div>
          
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CrewLink. All rights reserved.</p>
          
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}