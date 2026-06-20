// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// function Login() {
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:8080/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       const data = await res.json();
//       setUser({
//         token: data.token,
//         role: data.role
//       });

//       if (data.role === "admin") navigate("/admin");
//       else navigate("/");
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="card">
//         <h2>Welcome Back</h2>
//         <form onSubmit={handleLogin}>
          
//           <div className="input-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn-primary">Login</button>
          
//           <div className="link-text">
//             Don't have an account? <Link to="/signup">Sign up here</Link>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;






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
      </div>
    </div>
  );
}

export default Login;