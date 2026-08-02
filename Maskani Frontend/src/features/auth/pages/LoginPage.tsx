import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await auth.login({ email, password });

      if (user.role === "Owner") {
        navigate("/owner");
      } else if (user.role === "Student") {
        navigate("/student");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "400px" }}>
      <h1>Login</h1>

      {justRegistered && (
        <p style={{ color: "green" }}>
          Registration successful — log in below.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: "16px" }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}