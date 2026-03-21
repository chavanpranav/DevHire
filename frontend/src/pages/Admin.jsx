import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Admin() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  
  // Form States
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null); // Keeps track of if we are Editing or Adding

  // 1. GET: Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. POST / PUT: Handle Add or Edit Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jobData = { title, company, location, description };
    
    // If we have an editingId, we use PUT (Update). Otherwise, POST (Add new).
    const url = editingId 
      ? `http://localhost:8080/api/jobs/${editingId}` 
      : "http://localhost:8080/api/jobs";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}` // Sending the token to pass your backend middleware!
        },
        body: JSON.stringify(jobData)
      });

      if (res.ok) {
        alert(editingId ? "Job Updated Successfully!" : "Job Added Successfully!");
        // Clear form
        setTitle(""); setCompany(""); setLocation(""); setDescription(""); setEditingId(null);
        // Refresh list
        fetchJobs();
      } else {
        alert("Action failed. Please check your admin permissions.");
      }
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  // 3. DELETE: Handle Remove Job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}` // Token required for delete
        }
      });

      if (res.ok) {
        fetchJobs(); // Refresh list after delete
      } else {
        alert("Failed to delete job.");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  // 4. Fill the form when clicking "Edit"
  const handleEditClick = (job) => {
    setEditingId(job._id);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setDescription(job.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to the form
  };

  // UI Layout
  return (
    <div className="page-wrapper" style={{ flexDirection: "column", padding: "2rem", alignItems: "center" }}>
      
      {/* Admin Form Card */}
      <div className="card" style={{ maxWidth: "600px", marginBottom: "2rem" }}>
        <h2>{editingId ? "Edit Job Posting" : "Add New Job"}</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Job Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Company</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="3"
              style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {editingId ? "Update Job" : "Publish Job"}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1, backgroundColor: "#64748b" }} 
                onClick={() => {
                  setEditingId(null); setTitle(""); setCompany(""); setLocation(""); setDescription("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Admin Job List */}
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h2 style={{ color: "#0f172a", marginBottom: "1.5rem" }}>Manage Existing Jobs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="card" style={{ maxWidth: "100%", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ marginTop: 0, color: "#4f46e5", fontSize: "1.25rem", marginBottom: "5px" }}>{job.title}</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>{job.company} • {job.location}</p>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => handleEditClick(job)}
                    style={{ padding: "8px 16px", backgroundColor: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(job._id)}
                    style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Admin;