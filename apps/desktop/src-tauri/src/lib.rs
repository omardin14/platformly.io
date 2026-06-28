//! platformly desktop backend.
//!
//! Day 1 is intentionally a thin shell: one IPC command that the frontend calls
//! to prove the Rust <-> TS bridge is alive. The kube/cloud/security/pty modules
//! arrive in later phases (see TODO.md).

/// Reports backend liveness + version to the frontend.
#[tauri::command]
fn app_status() -> String {
    format!(
        "platformly v{} — desktop shell online",
        env!("CARGO_PKG_VERSION")
    )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![app_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
