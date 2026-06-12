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

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const { user } = useContext(AuthContext); // Get user to check login status

  useEffect(() => {
    fetch("http://localhost:8080/api/jobs") 
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleApply = async (jobId) => {
    if (!user) {
      alert("You must be logged in to apply for jobs!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/applications/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Application submitted successfully!");
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
            jobs.map((job) => (
              <div key={job._id} className="card" style={{ maxWidth: "100%", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                  <button 
                    onClick={() => handleApply(job._id)}
                    className="btn-primary"
                    style={{ padding: "0.5rem 1.5rem", height: "fit-content" }}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Jobs;