// import { useState, useEffect } from "react";

// function Jobs() {
//   const [jobs, setJobs] = useState([]);

//   // Fetch jobs from your backend
//   useEffect(() => {
//     fetch("http://localhost:8080/api/jobs") 
//       .then((res) => res.json())
//       .then((data) => setJobs(data))
//       .catch((err) => console.error("Error fetching jobs:", err));
//   }, []);

//   return (
//     <div className="page-wrapper" style={{ alignItems: "flex-start", padding: "2rem" }}>
//       <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        
//         <h2 style={{ color: "#0f172a", marginBottom: "1.5rem" }}>Available Jobs</h2>
        
//         <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//           {jobs.length === 0 ? (
//             <p>No jobs available right now.</p>
//           ) : (
//             jobs.map((job, index) => (
//               <div key={index} className="card" style={{ maxWidth: "100%", padding: "1.5rem" }}>
//                 <h3 style={{ marginTop: 0, color: "#4f46e5", fontSize: "1.25rem" }}>
//                   {job.title}
//                 </h3>
//                 <p style={{ margin: "0.5rem 0", color: "#64748b" }}>
//                   <strong>Company:</strong> {job.company}
//                 </p>
//                 <p style={{ margin: "0.5rem 0", color: "#64748b" }}>
//                   <strong>Location:</strong> {job.location}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Jobs;



import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:8080";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${BASE_URL}/api/jobs`) 
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  useEffect(() => {
    if (user && String(user.role).toUpperCase() === "USER") {
      fetch(`${BASE_URL}/api/applications/my`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const ids = data
            .map((app) => (app.job && app.job._id) ? app.job._id : app.job)
            .filter(Boolean);
          setAppliedJobIds(ids);
        }
      })
      .catch((err) => console.error("Error fetching user applications:", err));
    } else {
      setAppliedJobIds([]);
    }
  }, [user]);

  const handleApply = async (jobId) => {
    if (!user) {
      alert("You must be logged in to apply for jobs!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/applications/${jobId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Application submitted successfully!");
        setAppliedJobIds((prev) => [...prev, jobId]);
      } else {
        alert(data.message || "Failed to apply.");
      }
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  return (
    <div className="page-wrapper" style={{ alignItems: "flex-start", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        
        <h2 style={{ color: "#0f172a", marginBottom: "1.5rem" }}>Available Jobs</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {jobs.length === 0 ? (
            <p>No jobs available right now.</p>
          ) : (
            jobs.map((job) => {
              const hasApplied = appliedJobIds.includes(job._id);
              return (
                <div 
                  key={job._id} 
                  className="card" 
                  style={{ 
                    maxWidth: "100%", 
                    padding: "1.5rem", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderColor: hasApplied ? "#bbf7d0" : "var(--border)",
                    backgroundColor: hasApplied ? "#f0fdf4" : "var(--card-bg)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div>
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
                  
                  {/* Only show apply button for regular users, not employers */}
                  {(!user || String(user.role).toUpperCase() === "USER") && (
                    hasApplied ? (
                      <button 
                        disabled
                        className="btn-secondary"
                        style={{ 
                          padding: "0.5rem 1.5rem", 
                          height: "fit-content",
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          border: "1px solid #bbf7d0",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
                        </svg>
                        Applied
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(job._id)}
                        className="btn-primary"
                        style={{ padding: "0.5rem 1.5rem", height: "fit-content" }}
                      >
                        Apply Now
                      </button>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;