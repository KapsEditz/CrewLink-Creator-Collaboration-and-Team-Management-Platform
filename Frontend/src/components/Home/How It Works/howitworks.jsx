import React from "react";
import "./howitworks.css";

export default function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      
      {/* Note: Local aurora blobs removed. The global-aurora-bg handles this now. */}

      <div className="how-container">

        <div className="how-heading">
          <span className="how-badge">How It Works</span>
          <h2 className="how-title">
            Start Creating in <br />
            <span className="text-gradient">Three Simple Steps</span>
          </h2>
          <p className="how-subtitle">
            Whether you're a creator looking for teammates or a freelancer searching for exciting projects, CrewLink makes collaboration effortless.
          </p>
        </div>

        <div className="steps-grid">
          
          {/* Connecting line behind the cards */}
          <div className="step-line"></div>

          <div className="step-card glass-card">
            <div className="step-circle">1</div>
            <span className="step-tag">STEP 01</span>
            <h3>Create Profile</h3>
            <p>
              Build your creator profile, showcase your skills and upload your portfolio.
            </p>
          </div>

          <div className="step-card glass-card">
            <div className="step-circle">2</div>
            <span className="step-tag">STEP 02</span>
            <h3>Find Your Crew</h3>
            <p>
              Discover talented collaborators and invite them to your creative project.
            </p>
          </div>

          <div className="step-card glass-card">
            <div className="step-circle">3</div>
            <span className="step-tag">STEP 03</span>
            <h3>Create Together</h3>
            <p>
              Manage tasks, communicate efficiently and deliver amazing work.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}