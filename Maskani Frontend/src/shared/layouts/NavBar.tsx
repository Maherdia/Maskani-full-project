import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function NavBar() {
  const auth = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate("/");
  }

  function dashboardPath() {
    if (auth.user?.role === "Owner") return "/owner";
    if (auth.user?.role === "Student") return "/student";
    if (auth.user?.role === "User") return "/admin";
    return "/profile";
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link to="/">Maskani</Link>
      <Link to="/dorms">Browse Dorms</Link>

      {auth.loading ? null : auth.isAuthenticated ? (
        <>
          <Link to={dashboardPath()}>Dashboard</Link>
          {auth.user?.role === "Owner" && <Link to="/owner/add-dorm">Add Dorm</Link>}

          <span style={{ marginLeft: "auto" }}>
            {auth.user?.firstName} ({auth.user?.role})
          </span>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <span style={{ marginLeft: "auto" }} />
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}