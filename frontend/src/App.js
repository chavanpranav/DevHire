import { useEffect, useState } from "react";

function App() {

  // Job Data States
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  // Auth States
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= FETCH JOBS =================
  const fetchJobs = () => {
    fetch("http://localhost:8080/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= ADD JOB =================
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, company, location })
    })
      .then(res => res.json())
      .then(() => {
        fetchJobs();
        setTitle("");
        setCompany("");
        setLocation("");
      });
  };

  // ================= DELETE JOB =================
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        role: user?.role
      }
    }).then(() => fetchJobs());
  };

  // ================= EDIT JOB =================
  const handleEdit = (job) => {
    const newTitle = prompt("Enter new title", job.title);
    if (!newTitle) return;

    fetch(`http://localhost:8080/api/jobs/${job._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        role: user?.role
      },
      body: JSON.stringify({
        title: newTitle,
        company: job.company,
        location: job.location
      })
    }).then(() => fetchJobs());
  };

  // ================= LOGIN =================
  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) throw new Error("Login Failed");
        return res.json();
      })
      .then(data => {
        setUser(data);
        alert(`Logged in as ${data.role}`);
      })
      .catch(() => alert("Invalid Credentials"));
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setUser(null);
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px" }}>

      <h1>Job Portal</h1>

      {/* LOGIN SECTION */}
      {!user ? (
        <form
          onSubmit={handleLogin}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            width: "300px"
          }}
        >
          <h3>Login</h3>

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />

          <button type="submit">Login</button>
        </form>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <p>
            Welcome, {user.email} ({user.role})
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* ADD JOB FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Job Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />

        <input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />

        <button type="submit">Add Job</button>
      </form>

      {/* JOB LIST */}
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            {job.title} - {job.company} ({job.location})

            {user?.role === "admin" && (
              <>
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
