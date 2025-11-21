// app/login/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password.trim()) { setErr("Please enter email and password"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else setErr("Login failed");
    } catch (error: any) {
      setErr(error?.response?.data?.msg || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="container">
      <div className="card fade-in" style={{ maxWidth: 820, margin: "48px auto" }}>
        <h2>Sign in</h2>
        <p className="lead">Welcome back — enter your credentials to continue.</p>

        {err && <div style={{ margin: "12px 0" }} className="card" >
          <div style={{ padding: 12, color: "#ffdddd", background: "rgba(255,80,80,0.06)" }}>{err}</div>
        </div>}

        <form onSubmit={submit} className="form-column" style={{ marginTop: 12 }}>
          <div className="form-column">
            <label className="small" style={{ color: "var(--muted)" }}>Email</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-column" style={{ marginTop: 8 }}>
            <label className="small" style={{ color: "var(--muted)" }}>Password</label>
            <input className="form-control" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
            <a className="btn btn-ghost" href="/signup">Create Account</a>
          </div>
        </form>
      </div>
    </div>
  );
}
