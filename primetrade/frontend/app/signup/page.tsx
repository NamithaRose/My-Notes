// app/signup/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!name.trim() || !email.trim() || password.length < 6) { setErr("Provide name, email and password (min 6 chars)"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/signup`, { name, email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else setErr("Signup failed");
    } catch (error: any) {
      setErr(error?.response?.data?.msg || "Signup failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="container">
      <div className="card slide-up" style={{ maxWidth: 860, margin: "48px auto" }}>
        <h2>Create account</h2>
        <p className="lead">Create your account to start managing tasks.</p>

        {err && <div style={{ margin: "12px 0" }} className="card" >
          <div style={{ padding: 12, color: "#ffdddd", background: "rgba(255,80,80,0.06)" }}>{err}</div>
        </div>}

        <form onSubmit={submit} className="form-column" style={{ marginTop: 12 }}>
          <div className="form-column">
            <label className="small" style={{ color: "var(--muted)" }}>Full name</label>
            <input className="form-control" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="form-column" style={{ marginTop: 8 }}>
            <label className="small" style={{ color: "var(--muted)" }}>Email</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-column" style={{ marginTop: 8 }}>
            <label className="small" style={{ color: "var(--muted)" }}>Password</label>
            <input className="form-control" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
            <a className="btn btn-ghost" href="/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
