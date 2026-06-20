// import { Link, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// function Navbar() {
//   const { user, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // 1. Clear the user data from React Context
//     setUser(null);
//     // 2. Send them back to the login screen
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">DevHire Portal</div>
//       <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        
//         {/* If the user IS logged in */}
//         {user ? (
//           <>
//             <Link to="/">Jobs</Link>
            
//             {/* Only show Admin link if their role is 'admin' */}
//             {user.role === "admin" && <Link to="/admin">Admin</Link>}
            
//             <button 
//               onClick={handleLogout}
//               style={{
//                 background: "transparent",
//                 border: "none",
//                 color: "var(--text-light)",
//                 fontSize: "1rem",
//                 fontWeight: "500",
//                 cursor: "pointer",
//                 padding: 0,
//                 fontFamily: "inherit"
//               }}
//               onMouseOver={(e) => e.target.style.color = "var(--primary)"}
//               onMouseOut={(e) => e.target.style.color = "var(--text-light)"}
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           /* If the user is NOT logged in */
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/signup">Sign Up</Link>
//           </>
//         )}

//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">DevHire Portal</div>
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        
        {user ? (
          <>
            <Link to="/">Jobs</Link>
            
            {/* Admin panel link for ADMIN role only */}
            {user.role === "ADMIN" && (
              <Link to="/admin">Admin Panel</Link>
            )}

            {/* Company dashboard link for COMPANY role */}
            {user.role === "COMPANY" && (
              <Link to="/company">My Dashboard</Link>
            )}

            {/* My Applications link for USER role */}
            {user.role === "USER" && (
              <Link to="/dashboard">My Applications</Link>
            )}
            
            <button 
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-light)",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                padding: 0,
                fontFamily: "inherit"
              }}
              onMouseOver={(e) => e.target.style.color = "var(--primary)"}
              onMouseOut={(e) => e.target.style.color = "var(--text-light)"}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;