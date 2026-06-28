import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// Surfaces backend liveness (the app_status IPC) + the cluster connection state.
export function StatusBar() {
  const [status, setStatus] = useState<{ ok: boolean; text: string }>({
    ok: false,
    text: "connecting to backend…",
  });

  useEffect(() => {
    invoke<string>("app_status")
      .then((text) => setStatus({ ok: true, text }))
      .catch((err) => {
        console.error("[app_status] IPC error:", err);
        setStatus({ ok: false, text: "backend unavailable" });
      });
  }, []);

  return (
    <footer className="statusbar">
      <span className="status-item" data-testid="backend-status">
        <span className={`status-dot ${status.ok ? "status-dot--ok" : "status-dot--err"}`} />
        {status.text}
      </span>
      <span className="statusbar__spacer" />
      <span className="status-item">
        <span className="status-dot status-dot--idle" />
        Not connected
      </span>
    </footer>
  );
}
