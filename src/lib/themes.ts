export type Theme = {
  id: string;
  label: string;
  color: string;
  accent: string;
  accentHover: string;
  accentSubtle: string;
  accentMuted: string;
};

export const THEMES: Theme[] = [
  {
    id: "black",
    label: "Black",
    color: "#6b7280",
    accent: "#6b7280",
    accentHover: "#4b5563",
    accentSubtle: "rgba(107,114,128,0.12)",
    accentMuted: "rgba(107,114,128,0.2)",
  },
  {
    id: "purple",
    label: "Purple",
    color: "#7c6ef7",
    accent: "#7c6ef7",
    accentHover: "#6357d4",
    accentSubtle: "rgba(124,110,247,0.08)",
    accentMuted: "rgba(124,110,247,0.18)",
  },
  {
    id: "blue",
    label: "Blue",
    color: "#3b82f6",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    accentSubtle: "rgba(59,130,246,0.12)",
    accentMuted: "rgba(59,130,246,0.2)",
  },
  {
    id: "pink",
    label: "Pink",
    color: "#ec4899",
    accent: "#ec4899",
    accentHover: "#db2777",
    accentSubtle: "rgba(236,72,153,0.12)",
    accentMuted: "rgba(236,72,153,0.2)",
  },
  {
    id: "violet",
    label: "Violet",
    color: "#8b5cf6",
    accent: "#8b5cf6",
    accentHover: "#7c3aed",
    accentSubtle: "rgba(139,92,246,0.12)",
    accentMuted: "rgba(139,92,246,0.2)",
  },
  {
    id: "indigo",
    label: "Indigo",
    color: "#6366f1",
    accent: "#6366f1",
    accentHover: "#4f46e5",
    accentSubtle: "rgba(99,102,241,0.12)",
    accentMuted: "rgba(99,102,241,0.2)",
  },
  {
    id: "orange",
    label: "Orange",
    color: "#f97316",
    accent: "#f97316",
    accentHover: "#ea6c0a",
    accentSubtle: "rgba(249,115,22,0.12)",
    accentMuted: "rgba(249,115,22,0.2)",
  },
  {
    id: "teal",
    label: "Teal",
    color: "#14b8a6",
    accent: "#14b8a6",
    accentHover: "#0d9488",
    accentSubtle: "rgba(20,184,166,0.12)",
    accentMuted: "rgba(20,184,166,0.2)",
  },
  {
    id: "bronze",
    label: "Bronze",
    color: "#b45309",
    accent: "#b45309",
    accentHover: "#92400e",
    accentSubtle: "rgba(180,83,9,0.12)",
    accentMuted: "rgba(180,83,9,0.2)",
  },
  {
    id: "mint",
    label: "Mint",
    color: "#10b981",
    accent: "#10b981",
    accentHover: "#059669",
    accentSubtle: "rgba(16,185,129,0.12)",
    accentMuted: "rgba(16,185,129,0.2)",
  },
];

export const DEFAULT_THEME_ID = "purple";

export function isThemeId(value: string | null | undefined): value is Theme["id"] {
  return THEMES.some((theme) => theme.id === value);
}
