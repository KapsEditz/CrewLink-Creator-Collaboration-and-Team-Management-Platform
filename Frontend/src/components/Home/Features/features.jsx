import React, { useState } from "react";
import "./features.css";
import { 
  FiUsers, 
  FiMessageSquare, 
  FiFolder, 
  FiCheckSquare, 
  FiZap, 
  FiShield, 
  FiStar,
  FiCheck
} from "react-icons/fi";

export default function Features() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Thumbnail v2 approval", completed: true },
    { id: 2, title: "Color grading rough cut", completed: true },
    { id: 3, title: "Sound design sync", completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <section className="features-section" id="features">
      
      {/* Note: Local aurora blobs removed! Global aurora handles this now. */}

      <div className="features-container">
        
        <div className="features-heading">
          <div className="features-badge">Product Capabilities</div>
          <h2 className="features-title">
            Built for how creative <br />
            <span className="text-gradient">teams actually work.</span>
          </h2>
          <p className="features-subtitle">
            Everything creators need to discover talent, manage workflows, and deliver elite work—without leaving the workspace.
          </p>
        </div>

        <div className="bento-grid">
          
          {/* Card 1: Talent */}
          <div className="bento-card col-span-2 group">
            <div className="card-header">
              <div className="icon-box"><FiUsers className="feature-icon" /></div>
              <div>
                <h3>Find Verified Collaborators</h3>
                <p>Filter top-tier video editors, thumbnail designers, and scriptwriters by portfolio proof, not fluff.</p>
              </div>
            </div>
            <div className="ui-preview-talent glass-inner">
              <div className="talent-pill">
                <div className="talent-avatar avatar-1"></div>
                <div className="talent-info">
                  <span className="talent-name">Alex Rivera</span>
                  <span className="talent-role">Senior Premiere Editor</span>
                </div>
                <span className="talent-status"><span className="status-dot"></span> Available</span>
              </div>
              <div className="talent-pill highlight">
                <div className="talent-avatar avatar-2"></div>
                <div className="talent-info">
                  <span className="talent-name">Elena Rostova</span>
                  <span className="talent-role">3D Motion Designer</span>
                </div>
                <span className="talent-match">98% Match</span>
              </div>
            </div>
          </div>

          {/* Card 2: Chat */}
          <div className="bento-card col-span-1 group">
            <div className="card-header vertical">
              <div className="icon-box"><FiMessageSquare className="feature-icon" /></div>
              <h3>Contextual Team Chat</h3>
              <p>Real-time discussions attached directly to timeline cuts and deliverables.</p>
            </div>
            <div className="ui-preview-chat glass-inner">
              <div className="chat-bubble left">
                <span>Can we darken the background color here?</span>
              </div>
              <div className="chat-bubble right">
                <span>Updated! Check v3 draft. ✨</span>
              </div>
            </div>
          </div>

          {/* Card 3: Workspace */}
          <div className="bento-card col-span-1 group">
            <div className="card-header vertical">
              <div className="icon-box"><FiFolder className="feature-icon" /></div>
              <h3>Smart Workspace</h3>
              <p>Keep raw footage, project files, and final exports organized.</p>
            </div>
            <div className="ui-preview-file glass-inner">
              <div className="file-box">
                <div className="file-icon">RAW</div>
                <div className="file-details">
                  <span className="file-name text-light">Final_Cut_v3.mp4</span>
                  <div className="file-progress-bar"><div className="file-progress-fill"></div></div>
                </div>
                <span className="file-size">1.4 GB</span>
              </div>
            </div>
          </div>

          {/* Card 4: Milestones */}
          <div className="bento-card col-span-2 group">
            <div className="card-header">
              <div className="icon-box"><FiCheckSquare className="feature-icon" /></div>
              <div>
                <h3>Interactive Milestones & Tasks</h3>
                <p>Assign deliverables with auto-generated release triggers and approvals.</p>
              </div>
            </div>
            <div className="ui-preview-tasks glass-inner">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-row ${task.completed ? "completed" : ""}`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="task-checkbox">
                    {task.completed && <FiCheck strokeWidth={3} />}
                  </div>
                  <span className="task-text">{task.title}</span>
                  <span className="task-tag">{task.completed ? "Done" : "In Progress"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Instant Launch */}
          <div className="bento-card col-span-1 group min-card">
            <div className="card-header vertical">
              <div className="icon-box"><FiZap className="feature-icon" /></div>
              <h3>Instant Launch</h3>
              <p>Kick off projects instantly with pre-configured templates.</p>
            </div>
            <div className="card-abstract-bg abstract-blue"></div>
          </div>

          {/* Card 6: Secure Handoff */}
          <div className="bento-card col-span-1 group min-card">
            <div className="card-header vertical">
              <div className="icon-box"><FiShield className="feature-icon" /></div>
              <h3>Secure Handoff</h3>
              <p>Protected asset delivery and frictionless milestone payouts.</p>
            </div>
            <div className="card-abstract-bg abstract-purple"></div>
          </div>

          {/* Card 7: Reputation */}
          <div className="bento-card col-span-1 group min-card">
            <div className="card-header vertical">
              <div className="icon-box"><FiStar className="feature-icon" /></div>
              <div className="reputation-header-flex">
                <div>
                  <h3>Reputation</h3>
                  <p>Unforgeable client reviews.</p>
                </div>
                <div className="mini-rating">
                  <span className="rating-score">4.95</span>
                  <div className="rating-stars">
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                    <FiStar fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-abstract-bg abstract-cyan"></div>
          </div>

        </div>
      </div>
    </section>
  );
}