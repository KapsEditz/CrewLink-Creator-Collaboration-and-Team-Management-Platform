import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { FiBriefcase, FiUser, FiCheckCircle, FiLoader, FiGlobe } from "react-icons/fi";
import toast from "react-hot-toast";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]); 

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const toastId = toast.loading("Submitting application...");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/projects/${jobId}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setAppliedJobs([...appliedJobs, jobId]);
        toast.success("Application submitted!", { id: toastId });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to apply", { id: toastId }); 
      }
    } catch (error) {
      toast.error("Network error", { id: toastId });
    }
  };

  if (isLoading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}><FiLoader className="spin-icon" size={24} /> Loading open jobs...</div>;

  return (
    <div style={{ padding: "0", color: "var(--text-main)", maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Global Job Board</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", margin: 0 }}>Browse open projects from elite creators and apply to join their crew.</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="premium-card" style={{ padding: "5rem 2rem", textAlign: "center", border: "1px dashed var(--border-color)" }}>
          <FiBriefcase size={48} style={{ marginBottom: "1rem", color: "var(--text-muted)", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>No Open Jobs</h3>
          <p style={{ color: "var(--text-muted)" }}>Creators haven't posted any public projects yet. Keep your skills sharp and check back soon!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {jobs.map(job => (
            <div key={job._id} className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.4" }}>{job.title}</h3>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "4px 10px", borderRadius: "100px", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiGlobe size={12}/> Actively Hiring
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <img src={job.owner?.avatar || `https://ui-avatars.com/api/?name=${job.owner?.name}&background=6366f1&color=fff`} alt="Creator" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 0.15rem 0", textTransform: "uppercase", fontWeight: "700" }}>Posted By</p>
                  <Link to={`/dashboard/profile/${job.owner?._id}`} style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem" }}>
                    {job.owner?.name || "Anonymous Creator"}
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                {(() => {
                  const userId = localStorage.getItem("userId");
                  const isApplicant = job.applicants && job.applicants.some(app => app === userId || app._id === userId);
                  const isCrew = job.crew && job.crew.some(c => c === userId || c._id === userId);
                  const justApplied = appliedJobs.includes(job._id);

                  if (isCrew) {
                    return (
                      <button disabled className="btn-request" style={{ background: "var(--bg-color)", color: "var(--accent-color)", border: "1px solid var(--border-color)", cursor: "not-allowed", boxShadow: "none" }}>
                        Currently on Crew
                      </button>
                    );
                  }

                  if (isApplicant || justApplied) {
                    return (
                      <button disabled className="btn-request" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.3)", cursor: "not-allowed", boxShadow: "none", display: "flex", gap: "0.5rem" }}>
                        <FiCheckCircle /> Application Submitted
                      </button>
                    );
                  }

                  return (
                    <button onClick={() => handleApply(job._id)} className="btn-request" style={{ width: "100%" }}>
                      Submit Application
                    </button>
                  );
                })()}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}