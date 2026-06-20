import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:8080";

const STATUS_STYLES = {
  ACCEPTED:            { bg: "#dcfce7", text: "#166534" },
  REJECTED:            { bg: "#fee2e2", text: "#991b1b" },
  UNDER_REVIEW:        { bg: "#fef9c3", text: "#854d0e" },
  INTERVIEW_SCHEDULED: { bg: "#ede9fe", text: "#5b21b6" },
  APPLIED:             { bg: "#e0e7ff", text: "#3730a3" },
};

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        // Backend route: GET /api/applications/my
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

  if (loading) {
    return (
      <div className="page-wrapper">
        <p style={{ color: "var(--text-light)" }}>Loading your applications…</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ alignItems: "flex-start", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "820px", margin: "0 auto" }}>
        <h2 style={{ color: "#0f172a", marginBottom: "1.5rem" }}>My Applications</h2>

        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <h3 style={{ color: "var(--text-light)" }}>You haven't applied to any jobs yet.</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {applications.map((app) => {
              const styleColors = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED;
              // Backend populates: app.job → { title, location, company: { name } }
              const jobTitle   = app.job?.title    || "Job Unavailable";
              const company    = app.job?.company?.name || app.job?.company || "—";
              const location   = app.job?.location  || "";
              const appliedOn  = app.createdAt
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
                  }}
                >
                  <div>
                    <h3 style={{ marginTop: 0, color: "var(--primary)", fontSize: "1.15rem", marginBottom: "0.25rem" }}>
                      {jobTitle}
                    </h3>
                    <p style={{ margin: 0, color: "var(--text-light)", fontSize: "0.9rem" }}>
                      {company}{location ? ` • ${location}` : ""} &nbsp;·&nbsp; Applied {appliedOn}
                    </p>
                  </div>

                  <span style={{
                    backgroundColor: styleColors.bg,
                    color: styleColors.text,
                    padding: "0.4rem 1rem",
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