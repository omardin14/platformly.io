import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_PORT is derived per-worktree by scripts/lib/ports.sh (defaults to 1420 on main).
const host = process.env.TAURI_DEV_HOST;
const port = Number(process.env.VITE_PORT ?? 1420);

// https://vite.dev/config/ — tuned for Tauri (fixed port, ignore the Rust dir).
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: port + 1 } : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
