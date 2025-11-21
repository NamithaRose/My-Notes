// app/components/Toast.tsx
"use client";
export function showToast(msg: string, type: "success"|"error" = "success") {
  const area = document.getElementById("toast-area") || (() => { const a = document.createElement("div"); a.id = "toast-area"; document.body.appendChild(a); return a; })();
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.style = "margin-top:8px;padding:10px;border-radius:8px;background:rgba(0,0,0,0.6);color:white;";
  el.textContent = msg;
  area.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
