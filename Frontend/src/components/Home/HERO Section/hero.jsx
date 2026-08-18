import React, { useState, useEffect } from 'react';
import './hero.css';
import dashboardMockup from '../../../assets/hero-image.png'; 

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        
        <div className="hero-content">
          <div className={`announcement-pill ${isMounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.1s' }}>
            <span className="pill-badge">New</span>
            <span className="pill-text">CrewLink Beta is live</span>
            <span className="pill-arrow">→</span>
          </div>
          
          <h1 className={`hero-title ${isMounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            Build your dream <br /> 
            <span className="text-gradient">creator team.</span>
          </h1>
          
          {/* Note the &nbsp; between "one" and "place." to stop orphan words */}
          <p className={`hero-subtitle ${isMounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.3s' }}>
            The ultimate workspace for the creator economy. Find, hire, and manage elite video editors and designers—all in one&nbsp;place.
          </p>
          
          <div className={`hero-actions-wrapper ${isMounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="hero-cta">
              <button className="btn-hero-primary">Get Started Free</button>
              <button className="btn-hero-secondary">Book a Demo</button>
            </div>
          </div>
        </div>

        <div className={`hero-visual ${isMounted ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.6s' }}>
          <div className="browser-mockup">
            <div className="browser-header">
              <div className="browser-dots">
                <span className="dot dot-close"></span>
                <span className="dot dot-min"></span>
                <span className="dot dot-max"></span>
              </div>
              <div className="browser-url">app.crewlink.com</div>
            </div>
            <div className="browser-body">
              <img 
                src={dashboardMockup} 
                alt="CrewLink Dashboard" 
                className="dashboard-image" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;