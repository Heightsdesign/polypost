import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login/", { username, password });
      setAuthToken(res.data.access);
      navigate("/dashboard");
    } catch (err) {
      setError("Incorrect username or password.");
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "40px auto", textAlign: "center" }}>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />

        <button type="submit" style={{ padding: 12, marginTop: 10 }}>
          Login
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <div style={{ marginTop: 20 }}>
        <Link to="/forgot-password" style={{ fontSize: 14, color: "#007bff" }}>
          Forgot your password?
        </Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <span style={{ fontSize: 14 }}>No account yet? </span>
        <Link to="/register" style={{ fontSize: 14, color: "#007bff" }}>
          Register
        </Link>
      </div>
    </div>
  );
}
