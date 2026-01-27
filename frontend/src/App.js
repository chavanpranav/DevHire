import { useEffect, useState } from "react";

function App() {

  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [user, setUser] = useState(null);


  // fetch jobs
  const fetchJobs = () => {
    fetch("http://localhost:8080/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, company, location })
    })
      .then(res => res.json())
      .then(data => {
        fetchJobs(); // refresh list
        setTitle(""); setCompany(""); setLocation("");
      });
  };

  // delete function
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "role": user?.role
      }
    })
      .then(() => fetchJobs());
  };

  // update function (simple example: change title)
  const handleEdit = (job) => {
    const newTitle = prompt("Enter new title", job.title);
    if (!newTitle) return;

    fetch(`http://localhost:8080/api/jobs/${job._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "role": user?.role
      },
      body: JSON.stringify({ ...job, title: newTitle })
    })
      .then(() => fetchJobs());
  };

  const login = () => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@test.com",
        password: "1234"
      })
    })
      .then(res => res.json())
      .then(data => setUser(data));
  };


  return (
    <div>
      <h1>Job List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />
        <button type="submit">Add Job</button>
      </form>

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
