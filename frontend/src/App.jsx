import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import UserDashboard from "./pages/UserDashboard"; // <-- Add this line right here!
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {/* Navbar shows at the top of every page */}
      <Navbar /> 
      
      <Routes>
        {/* If user is NOT logged in, redirect them to the Login page */}
        <Route 
          path="/" 
          element={user ? <Jobs /> : <Navigate to="/login" />} 
        />
        
        {/* Separate Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin/Company Page */}
        <Route path="/admin" element={user && (user.role === "ADMIN" || user.role === "COMPANY") ? <Admin /> : <Navigate to="/" />} />

        {/* User Dashboard Page */}
        <Route path="/dashboard" element={user && user.role === "USER" ? <UserDashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;