import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import type { UserRole } from "../types/auth.types";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ firstName, lastName, phone, email, password, role });

      // Backend register endpoint doesn't return a token, only id + role,
      // so we can't auto-login here — send them to Login to sign in for real.
      navigate("/login", {
        state: { registered: true },
      });
    } catch (err) {
      setError("Registration failed. Check your details and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "400px" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First name</label>
          <br />
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="lastName">Last name</label>
          <br />
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="phone">Phone</label>
          <br />
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "12px" }}>
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
            minLength={6}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="role">I am a</label>
          <br />
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="Student">Student</option>
            <option value="Owner">Dorm Owner</option>
            <option value="User">Other / General user</option>
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: "16px" }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}