import { Icon } from "./Icon";

const IS_MAC =
  typeof navigator !== "undefined" && /mac/i.test(navigator.userAgent);

export function TopBar({
  title,
  onOpenPalette,
}: {
  title: string;
  onOpenPalette: () => void;
}) {
  return (
    <header className="topbar">
      <span className="topbar__title">{title}</span>
      <span className="topbar__crumb">· no cluster connected</span>
      <span className="topbar__spacer" />
      <button className="cmdk-btn" onClick={onOpenPalette} aria-label="Open command palette">
        <Icon name="search" size={15} />
        <span>Search…</span>
        <span className="kbd">{IS_MAC ? "⌘" : "Ctrl"} K</span>
      </button>
    </header>
  );
}
