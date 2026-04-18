import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0f0f17", overflow: "hidden" }}>
      {children}
    </div>
  );
}
