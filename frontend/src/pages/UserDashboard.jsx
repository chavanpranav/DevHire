import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "https://devhire-fm0p.onrender.com";

const STATUS_STYLES = {
  ACCEPTED:            { bg: "#dcfce7", text: "#166534" },
  REJECTED:            { bg: "#fee2e2", text: "#991b1b" },
  UNDER_REVIEW:        { bg: "#fef9c3", text: "#854d0e" },
  INTERVIEW_SCHEDULED: { bg: "#ede9fe", text: "#5b21b6" },
  APPLIED:             { bg: "#e0e7ff", text: "#3730a3" },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconShieldCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/applications/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyApplications();
  }, [user]);

  // Aggregate application stats
  const totalApps = applications.length;
  const pendingApps = applications.filter(
    (app) => app.status === "APPLIED" || app.status === "UNDER_REVIEW"
  ).length;
  const activeApps = applications.filter(
    (app) => app.status === "ACCEPTED" || app.status === "INTERVIEW_SCHEDULED"
  ).length;

  const filteredApplications = applications.filter((app) => {
    const jobTitle = (app.job?.title || "").toLowerCase();
    const company = (app.job?.company?.name || app.job?.company || "").toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = jobTitle.includes(query) || company.includes(query);

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && app.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="page-wrapper">
        <p style={{ color: "var(--text-light)" }}>Loading your applications…</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 70px)", padding: "2rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#0f172a", margin: "0 0 0.5rem", fontSize: "1.6rem", fontWeight: "700" }}>
            Candidate Dashboard
          </h2>
          <p style={{ margin: 0, color: "var(--text-light)", fontSize: "0.95rem" }}>
            Track the status, schedule, and response of all your job applications.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="candidate-stats-grid">
          <div className="candidate-stat-card">
            <div className="candidate-stat-icon" style={{ backgroundColor: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}>
              <IconBriefcase />
            </div>
            <div className="candidate-stat-info">
              <h3>{totalApps}</h3>
              <p>Total Submitted</p>
            </div>
          </div>

          <div className="candidate-stat-card">
            <div className="candidate-stat-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#d97706" }}>
              <IconClock />
            </div>
            <div className="candidate-stat-info">
              <h3>{pendingApps}</h3>
              <p>Under Review</p>
            </div>
          </div>

          <div className="candidate-stat-card">
            <div className="candidate-stat-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
              <IconShieldCheck />
            </div>
            <div className="candidate-stat-info">
              <h3>{activeApps}</h3>
              <p>Shortlisted / Interview</p>
            </div>
          </div>
        </div>

        {/* Controls: Search and Status Filter */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap"
        }}>
          <div className="job-search-box" style={{ flex: 1, minWidth: "280px", marginBottom: 0 }}>
            <span className="job-search-icon">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="job-search-input"
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["ALL", "APPLIED", "UNDER_REVIEW", "INTERVIEW_SCHEDULED", "ACCEPTED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: statusFilter === status ? "var(--primary)" : "var(--border)",
                  backgroundColor: statusFilter === status ? "var(--primary)" : "white",
                  color: statusFilter === status ? "white" : "var(--text-light)",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit"
                }}
              >
                {status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3.5rem", maxWidth: "100%" }}>
            <h3 style={{ color: "var(--text-light)", fontWeight: "500", margin: 0 }}>
              {search || statusFilter !== "ALL" ? "No applications match your filters." : "You haven't applied to any jobs yet."}
            </h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredApplications.map((app) => {
              const styleColors = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED;
              const jobTitle = app.job?.title || "Job Unavailable";
              const company = app.job?.company?.name || app.job?.company || "—";
              const location = app.job?.location || "";
              const appliedOn = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—";

              return (
                <div
                  key={app._id}
                  className="card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.5rem",
                    maxWidth: "100%",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    borderRadius: "12px",
                    transition: "transform 0.15s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div>
                    <h3 style={{ marginTop: 0, color: "var(--text-main)", fontSize: "1.15rem", marginBottom: "0.35rem", fontWeight: "600" }}>
                      {jobTitle}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-light)", fontSize: "0.88rem" }}>
                      <span style={{ color: "var(--primary)", fontWeight: "600" }}>{company}</span>
                      {location && <span>• &nbsp;{location}</span>}
                      <span>• &nbsp;Applied {appliedOn}</span>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: styleColors.bg,
                    color: styleColors.text,
                    padding: "0.45rem 1rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    marginLeft: "1rem",
                  }}>
                    {app.status.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;