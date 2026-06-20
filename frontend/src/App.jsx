import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import CompanyDashboard from "./pages/CompanyDashboard";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public job listing — redirect to login if not logged in */}
        <Route
          path="/"
          element={user ? <Jobs /> : <Navigate to="/login" />}
        />

        {/* Auth pages */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Panel — ADMIN role only */}
        <Route
          path="/admin"
          element={user && user.role === "ADMIN" ? <Admin /> : <Navigate to="/" />}
        />

        {/* Company Dashboard — COMPANY role only */}
        <Route
          path="/company"
          element={user && user.role === "COMPANY" ? <CompanyDashboard /> : <Navigate to="/" />}
        />

        {/* User Dashboard — USER role only */}
        <Route
          path="/dashboard"
          element={user && user.role === "USER" ? <UserDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;