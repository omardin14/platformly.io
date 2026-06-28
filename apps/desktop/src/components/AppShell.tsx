import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { CommandPalette } from "./CommandPalette";
import { EmptyState } from "./EmptyState";
import { SECTIONS, type SectionId } from "../nav";

// The app shell: sidebar | (top bar / content / status bar), plus a ⌘K command
// palette. Content is a placeholder empty state until Phase 1 wires real views.
export function AppShell() {
  const [active, setActive] = useState<SectionId>("clusters");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const title = SECTIONS.find((s) => s.id === active)?.label ?? "";

  return (
    <div className="shell">
      <Sidebar active={active} onSelect={setActive} />
      <div className="main">
        <TopBar title={title} onOpenPalette={openPalette} />
        <main className="content">
          <EmptyState onConnect={openPalette} />
        </main>
        <StatusBar />
      </div>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
