// Minimal inline-SVG icon set — no icon-library dependency. Stroke-based, 18px,
// inherits `currentColor`. Add new glyphs here as features land.
import type { ReactNode } from "react";

export type IconName =
  | "clusters"
  | "resources"
  | "shield"
  | "training"
  | "ai"
  | "search"
  | "plug";

const PATHS: Record<IconName, ReactNode> = {
  clusters: (
    <>
      <rect x="3" y="3" width="18" height="6" rx="1.5" />
      <rect x="3" y="11" width="18" height="6" rx="1.5" />
      <path d="M7 6h.01M7 14h.01" />
    </>
  ),
  resources: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9.5 12l2 2 3.5-4" />
    </>
  ),
  training: (
    <>
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M7 10v4c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5v-4" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3z" />
      <path d="M18 15l.7 1.8L20.5 17l-1.8.7L18 19l-.7-1.3L15.5 17l1.8-.2L18 15z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  plug: (
    <>
      <path d="M9 2v6M15 2v6" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8z" />
      <path d="M12 17v5" />
    </>
  ),
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
