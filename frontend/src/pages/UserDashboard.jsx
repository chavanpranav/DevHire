import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/applications/me", {
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyApplications();
  }, [user]);

  // Helper function for UI color coding
  const getStatusColor = (status) => {
    switch(status) {
      case "ACCEPTED": return { bg: "#dcfce7", text: "#166534" };
      case "REJECTED": return { bg: "#fee2e2", text: "#991b1b" };
      case "UNDER_REVIEW": return { bg: "#fef9c3", text: "#854d0e" };
      default: return { bg: "#e0e7ff", text: "#3730a3" }; // APPLIED
    }
  };

  if (loading) return <div className="page-wrapper"><p>Loading your applications...</p></div>;

  return (
    <div className="page-wrapper" style={{ alignItems: "flex-start", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#0f172a", marginBottom: "1.5rem" }}>My Applications</h2>
        
        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <h3 style={{ color: "var(--text-light)" }}>You haven't applied to any jobs yet.</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {applications.map((app) => {
              const statusColors = getStatusColor(app.status);
              
              return (
                <div key={app._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem" }}>
                  <div>
                    <h3 style={{ marginTop: 0, color: "var(--primary)", fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                      {app.jobId?.title || "Job Unavailable"}
                    </h3>
                    <p style={{ margin: 0, color: "var(--text-light)" }}>
                      {app.jobId?.company} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <span style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    fontWeight: "600",
                    fontSize: "0.875rem"
                  }}>
                    {app.status.replace("_", " ")}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;