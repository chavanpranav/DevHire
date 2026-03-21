import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Added role state

  const handleSignup = async (e) => {
    e.preventDefault();

    // Sending all 3 inputs to your backend
    const res = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }), 
    });

    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else {
      alert("Signup failed. User may already exist.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          
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

          {/* New Role Selection Dropdown */}
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
              <option value="user">Job Seeker (User)</option>
              <option value="admin">Employer (Admin)</option>
            </select>
          </div>

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