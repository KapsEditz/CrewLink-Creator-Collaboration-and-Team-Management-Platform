import React from "react";
import "./cta.css";

export default function CTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-container">
        
        <div className="cta-card">
          
          {/* Subtle inner lighting for the premium glass effect */}
          <div className="cta-glow glow-1"></div>
          <div className="cta-glow glow-2"></div>

          <div className="cta-content">
            <span className="cta-badge">Start Building Today</span>
            
            <h2 className="cta-title">
              Ready to Build Your <br />
              <span className="text-gradient">Dream Creative Team?</span>
            </h2>
            
            <p className="cta-subtitle">
              Join thousands of creators, designers, developers, and editors collaborating on amazing projects every day with CrewLink.
            </p>

            <div className="cta-buttons">
              <button className="btn-cta-primary">Get Started Free</button>
              <button className="btn-cta-secondary">Contact Us</button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}