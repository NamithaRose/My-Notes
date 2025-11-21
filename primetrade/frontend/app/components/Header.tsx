// app/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Header component (client)
 * - Left: small logo + "Easy Task"
 * - Right: user's name (when logged in) and Logout button
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    axios.get(`${API}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    setProfile(null);
    router.push("/login");
  }

  return (
    <header style={{ width: "100%", background: "transparent", padding: "18px 0", marginBottom: 12 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* logo image (uses uploaded path) */}
          <img src="/mnt/data/Screenshot (50).png" alt="Easy Task" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: 0.2 }}>Easy Task</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Organize your day</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {profile ? (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#fff" }}>{profile.name || profile.email}</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>{profile.email}</div>
              </div>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <a className="btn btn-ghost" href="/login">Login</a>
              <a className="btn btn-primary" href="/signup">Sign up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
