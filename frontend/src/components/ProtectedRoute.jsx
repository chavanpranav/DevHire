// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (user.role !== "admin") {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;



import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Block regular users from admin pages
  if (user.role === "USER") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;