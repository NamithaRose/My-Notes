// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Note = {
  _id: string;
  title: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);

  // editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [saving, setSaving] = useState(false);

  // dialog state
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    axios
      .get(`${API}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfile(res.data);
        setChecking(false);
        loadNotes();
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, []);

  async function loadNotes() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/notes`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/notes`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?._id) setNotes((prev) => [res.data, ...prev]);
      else loadNotes();
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  }

  function beginEdit(n: Note) {
    setEditingId(n._id);
    setEditingTitle(n.title);
    setEditingContent(n.content || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  }

  async function saveEdit() {
    if (!editingId) return;
    if (!editingTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/api/notes/${editingId}`,
        { title: editingTitle, content: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => prev.map((n) => (n._id === res.data._id ? res.data : n)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  // open dialog for delete confirmation
  function confirmDelete(note: Note) {
    setPendingDelete(note);
    if (dialogRef.current) {
      try {
        dialogRef.current.showModal();
      } catch (e) {
        // fallback to browser confirm if <dialog> unsupported
        if (confirm(`Delete "${note.title}"?`)) {
          doDelete(note._id);
        } else {
          setPendingDelete(null);
        }
      }
    }
  }

  async function doDelete(id: string) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
      loadNotes();
    } finally {
      if (dialogRef.current && dialogRef.current.open) dialogRef.current.close();
      setPendingDelete(null);
    }
  }

  function cancelDialog() {
    if (dialogRef.current && dialogRef.current.open) dialogRef.current.close();
    setPendingDelete(null);
  }

  function filtered() {
    let a = notes.slice();
    if (q.trim()) {
      const s = q.toLowerCase();
      a = a.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(s) ||
          (n.content || "").toLowerCase().includes(s)
      );
    }
    if (sortBy === "newest")
      a.sort((x, y) => new Date(y.createdAt || 0).getTime() - new Date(x.createdAt || 0).getTime());
    else a.sort((x, y) => new Date(x.createdAt || 0).getTime() - new Date(y.createdAt || 0).getTime());
    return a;
  }

  if (checking) return <div className="container"><div className="card">Checking session…</div></div>;

  return (
    <div className="container">
      {/* top card: profile + create/edit form */}
      <div className="card slide-up" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 style={{ marginBottom: 6 }}>{profile?.name ? `Hello, ${profile.name}` : "Hello"}</h2>
            <div className="lead">{profile?.email}</div>
          </div>

          <div>
            <button
              className="btn btn-ghost"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>{editingId ? "Edit task" : "Create task"}</h3>

          <form
            onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit(); } : addNote}
            className="form-column"
          >
            <div className="form-column">
              <label style={{ color: "var(--muted)" }}>Title</label>
              <input
                className="form-control"
                value={editingId ? editingTitle : title}
                onChange={(e) => (editingId ? setEditingTitle(e.target.value) : setTitle(e.target.value))}
              />
            </div>

            <div className="form-column" style={{ marginTop: 10 }}>
              <label style={{ color: "var(--muted)" }}>Description</label>
              <textarea
                className="form-control"
                value={editingId ? editingContent : content}
                onChange={(e) => (editingId ? setEditingContent(e.target.value) : setContent(e.target.value))}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add task"}
              </button>
              {editingId ? (
                <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>

      {/* ====== CONTROLS ROW (search, select, reset) ====== */}
      <div className="controls-bar">
        <input
          className="form-control control-input"
          placeholder="Search title or description..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="form-control control-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button
          type="button"
          className="control-btn"
          onClick={() => {
            setQ("");
            setSortBy("newest");
          }}
        >
          Reset
        </button>
      </div>

      {/* list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
          <div className="card">Loading…</div>
        ) : filtered().length === 0 ? (
          <div className="card empty">No tasks yet</div>
        ) : (
          filtered().map((n) => (
            <div key={n._id} className="task-card card fade-in">
              <div style={{ flex: 1 }}>
                <div className="task-title">{n.title}</div>
                <div className="task-desc">{n.content}</div>
                <div className="small-muted" style={{ marginTop: 10 }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </div>
              </div>

              <div className="actions">
                <button className="action-btn btn-edit" onClick={() => beginEdit(n)}>
                  Edit
                </button>
                <button className="action-btn btn-delete" onClick={() => confirmDelete(n)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* native dialog for confirmation */}
      <dialog className="confirm-dialog" ref={dialogRef}>
        <div>
          <h3 style={{ margin: 0 }}>Confirm delete</h3>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            Are you sure you want to delete <strong>{pendingDelete?.title}</strong>? This action cannot be undone.
          </p>

          <div className="dialog-actions">
            <button className="btn btn-ghost" onClick={cancelDialog}>
              Cancel
            </button>
            <button
              className="btn btn-delete"
              onClick={() => {
                if (pendingDelete) doDelete(pendingDelete._id);
              }}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
