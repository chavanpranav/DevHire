import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Jobs</Link> |
      <Link to="/login">Login</Link> |
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;
