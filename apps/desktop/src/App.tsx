import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// Day 1: an empty shell that proves the Rust <-> TS IPC bridge is wired.
// The real app-shell layout (sidebar, command bar, panels) lands on Day 2.
export default function App() {
  const [status, setStatus] = useState<string>("connecting to backend…");

  useEffect(() => {
    invoke<string>("app_status")
      .then(setStatus)
      .catch((err) => setStatus(`backend unavailable: ${String(err)}`));
  }, []);

  return (
    <main className="shell">
      <div className="brand">
        <span className="logo" aria-hidden />
        <h1>platformly</h1>
      </div>
      <p className="tagline">The ultimate Kubernetes manager.</p>
      <p className="status" data-testid="app-status">
        {status}
      </p>
      <footer className="footer">Day 1 · building in public</footer>
    </main>
  );
}
