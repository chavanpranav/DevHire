import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080";

// ─── Status badge helper ──────────────────────────────────────────────────────
const STATUS_STYLES = {
  ACCEPTED:            { bg: "#dcfce7", text: "#166534" },
  REJECTED:            { bg: "#fee2e2", text: "#991b1b" },
  UNDER_REVIEW:        { bg: "#fef9c3", text: "#854d0e" },
  INTERVIEW_SCHEDULED: { bg: "#ede9fe", text: "#5b21b6" },
  APPLIED:             { bg: "#e0e7ff", text: "#3730a3" },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.APPLIED;
}

// ─── Company Dashboard ────────────────────────────────────────────────────────
function CompanyDashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Views: "jobs" | "post" | "applicants"
  const [view, setView]             = useState("jobs");
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [toast, setToast]           = useState(null);

  // Form state
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation]     = useState("");
  const [salary, setSalary]         = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch company jobs ──────────────────────────────────────────────────────
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/company`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setJobs(data);
      else showToast("Failed to fetch jobs.", "error");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  // ── Handle post / update ────────────────────────────────────────────────────
  const handleSubmitJob = async (e) => {
    e.preventDefault();
    const url    = editingJob ? `${BASE_URL}/api/jobs/${editingJob._id}` : `${BASE_URL}/api/jobs`;
    const method = editingJob ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, description, location, salary }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(editingJob ? "Job updated!" : "Job posted!");
        resetForm();
        setView("jobs");
        fetchJobs();
      } else {
        showToast(data.message || "Failed to save job.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setLocation(""); setSalary("");
    setEditingJob(null);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setTitle(job.title || "");
    setDescription(job.description || "");
    setLocation(job.location || "");
    setSalary(job.salary || "");
    setView("post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete job ──────────────────────────────────────────────────────────────
  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        showToast("Job deleted.");
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      } else {
        showToast("Failed to delete.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  // ── View applicants ─────────────────────────────────────────────────────────
  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    setView("applicants");
    setApplicantsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/applications/job/${job._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setApplicants(data);
      else setApplicants([]);
    } catch {
      showToast("Failed to fetch applicants.", "error");
    } finally {
      setApplicantsLoading(false);
    }
  };

  // ── Update application status ───────────────────────────────────────────────
  const handleStatusChange = async (applicationId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Status updated to ${status}`);
        setApplicants((prev) =>
          prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
        );
      } else {
        showToast(data.message || "Failed to update.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  const handleLogout = () => { setUser(null); navigate("/login"); };

  // ── UI ──────────────────────────────────────────────────────────────────────
  const navItems = [
    { key: "jobs",  label: "My Jobs" },
    { key: "post",  label: editingJob ? "Edit Job" : "Post a Job" },
  ];

  return (
    <div className="admin-layout">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>DevHire</h2>
          <span>Company Portal</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${view === item.key ? "active" : ""}`}
              onClick={() => {
                if (item.key !== "post") resetForm();
                setView(item.key);
              }}
            >
              {item.label}
            </button>
          ))}
          {view === "applicants" && selectedJob && (
            <button className="admin-nav-item active">
              Applicants — {selectedJob.title}
            </button>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">
              {(user?.name || "C").charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <p>{user?.name || "Company"}</p>
              <span>COMPANY</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* ── My Jobs View ── */}
        {view === "jobs" && (
          <>
            <div className="admin-header">
              <h1>My Job Postings</h1>
              <p>Manage all jobs your company has posted.</p>
            </div>

            <div className="admin-section">
              <div className="admin-section-header">
                <h2>All Jobs ({jobs.length})</h2>
                <button
                  className="admin-btn verify"
                  onClick={() => { resetForm(); setView("post"); }}
                  style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}
                >
                  + Post New Job
                </button>
              </div>

              {loading ? (
                <div className="admin-loading">
                  <div className="admin-spinner" /> Loading jobs…
                </div>
              ) : jobs.length === 0 ? (
                <div className="admin-empty">
                  <p>No jobs posted yet. Click "Post New Job" to get started.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Posted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <div className="admin-company-name">{job.title}</div>
                            <div className="admin-company-meta" style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {job.description}
                            </div>
                          </td>
                          <td style={{ color: "var(--admin-muted)" }}>{job.location || "—"}</td>
                          <td style={{ color: "var(--admin-muted)" }}>{job.salary || "—"}</td>
                          <td style={{ color: "var(--admin-muted)", fontSize: "0.82rem" }}>
                            {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-btn verify"
                                onClick={() => handleViewApplicants(job)}
                              >
                                Applicants
                              </button>
                              <button
                                className="admin-btn unverify"
                                onClick={() => handleEditClick(job)}
                              >
                                Edit
                              </button>
                              <button
                                className="admin-btn delete"
                                onClick={() => handleDelete(job._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Post / Edit Job View ── */}
        {view === "post" && (
          <>
            <div className="admin-header">
              <h1>{editingJob ? "Edit Job" : "Post a New Job"}</h1>
              <p>{editingJob ? "Update the details of your job posting." : "Fill in the details to publish a new job."}</p>
            </div>

            <div className="admin-section" style={{ maxWidth: 640 }}>
              <div className="admin-section-header">
                <h2>{editingJob ? "Edit Job Details" : "Job Details"}</h2>
              </div>
              <form onSubmit={handleSubmitJob} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="input-group">
                  <label>Job Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior React Developer" required />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote / Mumbai" />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Salary</label>
                    <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. ₹10-15 LPA" />
                  </div>
                </div>

                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                    placeholder="Describe the role, requirements, and responsibilities…"
                    required
                    style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontFamily: "inherit", fontSize: "1rem", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    {editingJob ? "Update Job" : "Publish Job"}
                  </button>
                  {editingJob && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ flex: 1, background: "var(--admin-muted)" }}
                      onClick={() => { resetForm(); setView("jobs"); }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* ── Applicants View ── */}
        {view === "applicants" && (
          <>
            <div className="admin-header">
              <h1>Applicants for "{selectedJob?.title}"</h1>
              <p>Review and update the status of each applicant.</p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <button className="admin-btn unverify" onClick={() => setView("jobs")} style={{ padding: "0.5rem 1rem" }}>
                ← Back to Jobs
              </button>
            </div>

            <div className="admin-section">
              {applicantsLoading ? (
                <div className="admin-loading">
                  <div className="admin-spinner" /> Loading applicants…
                </div>
              ) : applicants.length === 0 ? (
                <div className="admin-empty">
                  <p>No applications for this job yet.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Email</th>
                        <th>Applied On</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((app) => {
                        const style = getStatusStyle(app.status);
                        return (
                          <tr key={app._id}>
                            <td>
                              <div className="admin-company-name">{app.applicant?.name || "—"}</div>
                            </td>
                            <td style={{ color: "var(--admin-muted)" }}>{app.applicant?.email || "—"}</td>
                            <td style={{ color: "var(--admin-muted)", fontSize: "0.82rem" }}>
                              {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td>
                              {app.resume ? (
                                <a
                                  href={app.resume}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={`resume_${app.applicant?.name || "applicant"}.pdf`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    backgroundColor: "#ede9fe",
                                    color: "#5b21b6",
                                    padding: "0.35rem 0.75rem",
                                    borderRadius: "6px",
                                    fontSize: "0.78rem",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    border: "1px solid #ddd6fe"
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                  View Resume
                                </a>
                              ) : (
                                <span style={{ color: "var(--admin-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>No resume</span>
                              )}
                            </td>
                            <td>
                              <span style={{
                                background: style.bg, color: style.text,
                                padding: "4px 12px", borderRadius: 20,
                                fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap"
                              }}>
                                {app.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td>
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                style={{
                                  padding: "6px 10px", border: "1px solid var(--admin-border)",
                                  borderRadius: 7, fontSize: "0.8rem", fontFamily: "inherit",
                                  background: "var(--admin-bg)", cursor: "pointer"
                                }}
                              >
                                {["APPLIED", "UNDER_REVIEW", "INTERVIEW_SCHEDULED", "ACCEPTED", "REJECTED"].map((s) => (
                                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CompanyDashboard;
