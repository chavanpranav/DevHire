import { useState, useEffect } from "react";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  // Fetch jobs from your backend
  useEffect(() => {
    fetch("http://localhost:8080/api/jobs") 
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  return (
    <div className="page-wrapper" style={{ alignItems: "flex-start", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        
        <h2 style={{ color: "#0f172a", marginBottom: "1.5rem" }}>Available Jobs</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {jobs.length === 0 ? (
            <p>No jobs available right now.</p>
          ) : (
            jobs.map((job, index) => (
              <div key={index} className="card" style={{ maxWidth: "100%", padding: "1.5rem" }}>
                <h3 style={{ marginTop: 0, color: "#4f46e5", fontSize: "1.25rem" }}>
                  {job.title}
                </h3>
                <p style={{ margin: "0.5rem 0", color: "#64748b" }}>
                  <strong>Company:</strong> {job.company}
                </p>
                <p style={{ margin: "0.5rem 0", color: "#64748b" }}>
                  <strong>Location:</strong> {job.location}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Jobs;