import React, { useState } from "react";
import { FiSearch, FiFilter, FiStar, FiUserCheck } from "react-icons/fi";

export default function Talent() {
  const [freelancers, setFreelancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/freelancers")
      .then(res => res.json())
      .then(data => {
        setFreelancers(data);
        setIsLoading(false);
      });
  }, []);

  // ... rest of your return logic stays the same!

  // Simulates sending a request to the freelancer
  const handleRequest = (id) => {
    setFreelancers(freelancers.map(f => 
      f.id === id ? { ...f, requestState: "pending" } : f
    ));
    // Later, this is where we will tell MongoDB to create a "Hire Request"
  };

  return (
    <div className="talent-page">
      
      {/* Page Header & Search */}
      <div className="talent-header">
        <div>
          <h2>Talent Directory</h2>
          <p>Find and request elite creators for your next project.</p>
        </div>
        
        <div className="talent-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search by role or skill..." />
          </div>
          <button className="btn-filter">
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* The Freelancer Grid */}
      <div className="talent-grid">
        {freelancers.map((person) => (
          <div className="talent-card" key={person.id}>
            
            <div className="talent-card-top">
              <div className="avatar-large">{person.name.charAt(0)}</div>
              <div className="talent-status">
                <span className={`status-dot ${person.status === 'Available' ? 'green' : 'red'}`}></span>
                {person.status}
              </div>
            </div>

            <div className="talent-info">
              <h3>{person.name}</h3>
              <p className="talent-role">{person.role}</p>
              
              <div className="talent-metrics">
                <span className="rate">{person.rate}</span>
                <span className="rating"><FiStar className="star-icon"/> {person.rating}</span>
              </div>
            </div>

            <div className="talent-skills">
              {person.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>

            <div className="talent-card-bottom">
              {person.requestState === "idle" && person.status === "Available" && (
                <button className="btn-request" onClick={() => handleRequest(person.id)}>
                  Request to Hire
                </button>
              )}
              
              {person.requestState === "pending" && (
                <button className="btn-pending" disabled>
                  Request Sent...
                </button>
              )}

              {person.status === "Booked" && person.requestState === "idle" && (
                <button className="btn-unavailable" disabled>
                  Currently Unavailable
                </button>
              )}
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}