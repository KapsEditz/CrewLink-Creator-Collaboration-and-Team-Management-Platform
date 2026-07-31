import "./features.css";

export default function Feature() {
  return (
    <section className="features">
      <div className="container">
        <div className="features-heading">
          <span>WHY CREWLINK</span>
          <h2>
            Built for the Entire Creative Workflow.
          </h2>
          <p>
            Everything creators need to discover talent,
            collaborate efficiently and deliver exceptional
            work—from one beautifully designed platform.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              👥
            </div>
            <h3>Find Collaborators</h3>
            <p>
              Discover designers, editors, developers,
              writers and creators that perfectly fit
              your project.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🚀
            </div>
            <h3>Launch Projects</h3>
            <p>
              Create projects, invite members and start
              collaborating within minutes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              💬
            </div>
            <h3>Team Chat</h3>
            <p>
              Stay connected through real-time discussions,
              updates and instant feedback.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              📂
            </div>
            <h3>Project Workspace</h3>
            <p>
              Organize files, deadlines and tasks in one
              clean collaborative dashboard.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              📅
            </div>
            <h3>Task Management</h3>
            <p>
              Assign work, monitor progress and complete
              projects without confusion.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              ⭐
            </div>
            <h3>Build Reputation</h3>
            <p>
              Earn reviews, grow your network and become
              the creator everyone wants to work with.
            </p>
          </div>
        </div>


      </div>
    </section>
  );
}