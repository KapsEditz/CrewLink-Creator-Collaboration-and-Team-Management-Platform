import React from "react";
import "./testimonials.css";
import { FiStar, FiCheckCircle } from "react-icons/fi"; 

export default function Testimonials() {
  // Helper to render 5 stars cleanly
  const renderStars = () => (
    <div className="card-stars">
      <FiStar fill="currentColor" stroke="currentColor" />
      <FiStar fill="currentColor" stroke="currentColor" />
      <FiStar fill="currentColor" stroke="currentColor" />
      <FiStar fill="currentColor" stroke="currentColor" />
      <FiStar fill="currentColor" stroke="currentColor" />
    </div>
  );

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">

        <div className="testimonials-heading">
          <span className="testimonials-badge">Wall of Love</span>
          <h2 className="testimonials-title">
            Loved by <span className="text-gradient">Creative Teams</span>
          </h2>
          <p className="testimonials-subtitle">
            Thousands of creators trust CrewLink to discover collaborators, manage projects, and build amazing content together.
          </p>
        </div>

        <div className="testimonial-grid">
          
          {/* Card 1: Modern Verified Layout */}
          <div className="testimonial-card">
            <div className="card-header">
              <div className="avatar avatar-gradient-1">A</div>
              <div className="user-details">
                <h4>
                  Aryan Sharma 
                  <FiCheckCircle className="verified-icon" />
                </h4>
                <span>@aryansharma</span>
              </div>
            </div>
            {renderStars()}
            <p className="review-text">
              "CrewLink helped me find an amazing thumbnail designer in less than a day. The entire workflow from discovery to payment felt completely effortless."
            </p>
          </div>

          {/* Card 2 */}
          <div className="testimonial-card">
            <div className="card-header">
              <div className="avatar avatar-gradient-2">S</div>
              <div className="user-details">
                <h4>
                  Sarah Wilson 
                  <FiCheckCircle className="verified-icon" />
                </h4>
                <span>@sarahcreates</span>
              </div>
            </div>
            {renderStars()}
            <p className="review-text">
              "Managing projects has never been this simple. Everything stays perfectly organized and our entire production team is always on the exact same page."
            </p>
          </div>

          {/* Card 3 */}
          <div className="testimonial-card">
            <div className="card-header">
              <div className="avatar avatar-gradient-3">D</div>
              <div className="user-details">
                <h4>
                  David Lee 
                  <FiCheckCircle className="verified-icon" />
                </h4>
                <span>@david_edits</span>
              </div>
            </div>
            {renderStars()}
            <p className="review-text">
              "CrewLink became our exclusive go-to platform. We use it for finding top-tier video editors and managing our weekly upload schedule without spreadsheets."
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}