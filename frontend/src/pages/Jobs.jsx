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

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: "middle" }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: "middle" }}>
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: "middle" }}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SubmitApplicationModal = ({ job, onSubmit, onCancel }) => {
  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setError("");

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onload = () => {
      setBase64(reader.result);
      setLoading(false);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!base64) {
      setError("Please select a resume file first.");
      return;
    }
    onSubmit(job._id, base64);
  };

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-main)", fontSize: "1.2rem", fontWeight: "700" }}>Submit Application</h3>
        <p style={{ color: "var(--text-light)", fontSize: "0.85rem", marginBottom: "1.2rem", lineHeight: "1.4" }}>
          Apply to <strong>{job.title}</strong> at <strong>{job.company}</strong> by uploading your resume.
        </p>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text-light)", marginBottom: "0.5rem" }}>
              Upload Resume (PDF, DOC, or DOCX)
            </label>
            
            <div 
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "10px",
                padding: "2rem 1.5rem",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                backgroundColor: "#fafbfc",
                transition: "all 0.2s"
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("resume-file-input").click()}
            >
              <input 
                id="resume-file-input"
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: "none" }}
                required
              />
              
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-light)", marginBottom: "0.75rem" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              
              <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: "500", color: "var(--text-main)" }}>
                {fileName ? fileName : "Click to select a file"}
              </p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--text-light)" }}>
                {fileName ? "File loaded successfully" : "PDF or Word document up to 5MB"}
              </p>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-modal-cancel" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="admin-modal-confirm" style={{ backgroundColor: "var(--primary)" }} disabled={loading || !base64}>
              {loading ? "Reading..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${BASE_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
          if (data.length > 0) {
            setSelectedJobId(data[0]._id);
          }
        }
      })
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

  const handleApply = async (jobId, resumeBase64) => {
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
        },
        body: JSON.stringify({ resume: resumeBase64 })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Application submitted successfully!");
        setAppliedJobIds((prev) => [...prev, jobId]);
        setShowApplyModal(null);
      } else {
        alert(data.message || "Failed to apply.");
      }
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      (job.location || "").toLowerCase().includes(query)
    );
  });

  const selectedJob = jobs.find((j) => j._id === selectedJobId) || filteredJobs[0];

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 70px)", padding: "2rem 1.5rem" }}>
      {showApplyModal && (
        <SubmitApplicationModal
          job={showApplyModal}
          onSubmit={handleApply}
          onCancel={() => setShowApplyModal(null)}
        />
      )}
      <div className="jobs-split-container">
        
        {/* Left Pane - List of Jobs */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column" }}>
          <div className="job-search-box">
            <span className="job-search-icon">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="job-search-input"
            />
          </div>

          <div className="jobs-list-pane">
            {filteredJobs.length === 0 ? (
              <div className="card" style={{ maxWidth: "100%", padding: "2.5rem", textAlign: "center" }}>
                <p style={{ color: "var(--text-light)", margin: 0 }}>No jobs matching your search.</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const hasApplied = appliedJobIds.includes(job._id);
                const isActive = selectedJob && selectedJob._id === job._id;
                return (
                  <div
                    key={job._id}
                    className={`job-card-interactive ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedJobId(job._id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: "0 0 0.25rem", color: "var(--text-main)", fontSize: "1.05rem", fontWeight: "600" }}>
                        {job.title}
                      </h3>
                      {hasApplied && (
                        <span style={{
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}>
                          <IconCheck /> Applied
                        </span>
                      )}
                    </div>
                    <div style={{ color: "var(--primary)", fontWeight: "500", fontSize: "0.88rem" }}>
                      {job.company}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", fontSize: "0.82rem", color: "var(--text-light)" }}>
                      <span>
                        <IconMapPin />
                        {job.location || "Not specified"}
                      </span>
                      {job.salary && (
                        <span>
                          <IconDollar />
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane - Job Details */}
        <div className="jobs-detail-pane">
          {selectedJob ? (
            <>
              <div className="job-detail-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-main)", fontSize: "1.45rem", fontWeight: "700" }}>
                      {selectedJob.title}
                    </h2>
                    <p style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: "var(--primary)", fontWeight: "600" }}>
                      {selectedJob.company}
                    </p>
                  </div>

                  {(!user || String(user.role).toUpperCase() === "USER") && (
                    appliedJobIds.includes(selectedJob._id) ? (
                      <button
                        disabled
                        className="btn-secondary"
                        style={{
                          padding: "0.6rem 1.4rem",
                          height: "fit-content",
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          border: "1px solid #bbf7d0",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.9rem"
                        }}
                      >
                        <IconCheck />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowApplyModal(selectedJob)}
                        className="btn-primary"
                        style={{ padding: "0.6rem 1.4rem", height: "fit-content", fontSize: "0.9rem", marginTop: 0 }}
                      >
                        Apply Now
                      </button>
                    )
                  )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", fontSize: "0.88rem", color: "var(--text-light)" }}>
                    <IconMapPin />
                    <strong style={{ color: "var(--text-main)", marginRight: "0.25rem" }}>Location: </strong>
                    {selectedJob.location || "Not specified"}
                  </div>
                  {selectedJob.salary && (
                    <div style={{ display: "flex", alignItems: "center", fontSize: "0.88rem", color: "var(--text-light)" }}>
                      <IconDollar />
                      <strong style={{ color: "var(--text-main)", marginRight: "0.25rem" }}>Salary: </strong>
                      {selectedJob.salary}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", fontSize: "0.88rem", color: "var(--text-light)" }}>
                    <IconBriefcase />
                    <strong style={{ color: "var(--text-main)", marginRight: "0.25rem" }}>Type: </strong>
                    Full-Time
                  </div>
                </div>
              </div>

              <div className="job-detail-body">
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem", fontWeight: "600", color: "var(--text-main)" }}>
                  Job Description
                </h3>
                <div style={{ whiteSpace: "pre-wrap", color: "#475569", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {selectedJob.description}
                </div>
              </div>
            </>
          ) : (
            <div className="jobs-detail-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <h3>No Job Selected</h3>
              <p>Choose one of the available job listings on the left to review its details and submit your application.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Jobs;