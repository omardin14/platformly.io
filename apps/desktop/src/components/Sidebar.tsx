import { SECTIONS, type SectionId } from "../nav";
import { Icon } from "./Icon";

export function Sidebar({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden />
        <span className="sidebar__name">platformly</span>
      </div>
      <nav className="sidebar__nav" aria-label="Primary">
        <div className="sidebar__section">Workspace</div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`nav-item${s.id === active ? " nav-item--active" : ""}`}
            onClick={() => onSelect(s.id)}
            aria-current={s.id === active ? "page" : undefined}
          >
            <Icon name={s.icon} />
            <span className="nav-item__label">{s.label}</span>
            {s.badge && <span className="nav-item__badge">{s.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar__spacer" />
    </aside>
  );
}
