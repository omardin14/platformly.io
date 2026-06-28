import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";

interface Command {
  id: string;
  label: string;
  icon: IconName;
  hint?: string;
}

// Placeholder commands — wired to real actions as features land (Phase 1+).
const COMMANDS: Command[] = [
  { id: "connect", label: "Connect to a cluster…", icon: "plug", hint: "kubeconfig" },
  { id: "switch", label: "Switch context…", icon: "clusters" },
  { id: "search", label: "Search resources…", icon: "resources" },
  { id: "security", label: "Open Security Center", icon: "shield" },
  { id: "training", label: "Start a CKS lab", icon: "training" },
  { id: "ai", label: "Ask the AI assistant…", icon: "ai" },
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(
    () => COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="palette__overlay" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="palette__input"
          placeholder="Type a command or search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="palette__list">
          {filtered.length === 0 ? (
            <div className="palette__empty">No matching commands</div>
          ) : (
            filtered.map((c) => (
              // Commands are placeholders for now — selecting closes the palette.
              <button key={c.id} className="palette__item" onClick={onClose}>
                <Icon name={c.icon} size={16} />
                <span>{c.label}</span>
                {c.hint && <span className="palette__hint">{c.hint}</span>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
