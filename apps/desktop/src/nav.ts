import type { IconName } from "./components/Icon";

// The five top-level workspaces. Shared by the sidebar, the top bar title, and
// (later) routing. Each maps to a phase of the product: manage · secure · learn · AI.
export type SectionId = "clusters" | "resources" | "security" | "training" | "ai";

export interface Section {
  id: SectionId;
  label: string;
  icon: IconName;
  badge?: string;
}

export const SECTIONS: Section[] = [
  { id: "clusters", label: "Clusters", icon: "clusters" },
  { id: "resources", label: "Resources", icon: "resources" },
  { id: "security", label: "Security", icon: "shield", badge: "CKS" },
  { id: "training", label: "Training", icon: "training" },
  { id: "ai", label: "AI", icon: "ai" },
];
