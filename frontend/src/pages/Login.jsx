
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser({
        token: data.token,
        role: data.role
      });

      // Navigate based on role
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "COMPANY") {
        navigate("/company");
      } else {
        navigate("/");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Login</button>
          
          <div className="link-text">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </div>

        </form>

        <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.2rem" }}>
          <h4 style={{ margin: "0 0 0.75rem 0", color: "var(--text-light)", fontSize: "0.82rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Prototype Accounts
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => { setEmail("admin@devhire.com"); setPassword("admin123"); }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.55rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-color)",
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.backgroundColor = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--bg-color)"; }}
            >
              <span style={{ fontWeight: "600", color: "var(--primary)" }}>System Admin</span>
              <span style={{ color: "var(--text-light)", fontSize: "0.78rem" }}>admin@devhire.com (pw: admin123)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;