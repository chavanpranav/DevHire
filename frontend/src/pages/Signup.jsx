import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Uppercase to match backend Enum
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const url = role === "COMPANY" 
      ? "http://localhost:8080/api/company/register" 
      : "http://localhost:8080/api/signup";

    const bodyData = role === "COMPANY"
      ? { name, email, password, companyName, description }
      : { name, email, password, role };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData), 
    });

    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else {
      const data = await res.json();
      alert(`Signup failed: ${data.message || "User may already exist."}`);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Account Type</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "inherit",
                backgroundColor: "white",
                cursor: "pointer"
              }}
            >
              <option value="USER">Job Seeker</option>
              <option value="COMPANY">Employer / Admin</option>
            </select>
          </div>

          {role === "COMPANY" && (
            <>
              <div className="input-group">
                <label>Company Name</label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Company Description</label>
                <textarea
                  placeholder="Enter company description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  style={{
                    padding: "0.75rem",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontFamily: "inherit"
                  }}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary">Sign Up</button>
          
          <div className="link-text">
            Already have an account? <Link to="/login">Login here</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Signup;