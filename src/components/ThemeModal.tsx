"use client";

import { Check, Monitor, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { DEFAULT_THEME_ID, THEMES } from "@/lib/themes";

type ThemeModalProps = {
  open: boolean;
  onClose: () => void;
};

type AppearanceId = "light" | "dark" | "auto";

const APPEARANCE_OPTIONS: { id: AppearanceId; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "auto", label: "Auto" },
];

function AppearanceIcon({ id }: { id: AppearanceId }) {
  if (id === "light") return <Sun size={14} />;
  if (id === "auto") return <Monitor size={14} />;
  return <Moon size={14} />;
}

export function ThemeModal({ open, onClose }: ThemeModalProps) {
  const { theme, setTheme } = useTheme();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <>
      <div className="theme-overlay" onClick={onClose}>
        <div
          className="theme-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Customize CroFlux theme"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <h2>Customize</h2>
              <p>Personalize your CroFlux interface</p>
            </div>
            <button type="button" className="modal-close" onClick={onClose}>
              <X size={14} />
            </button>
          </div>

          <section className="modal-section">
            <div className="section-label">Appearance</div>
            <div className="appearance-grid">
              {APPEARANCE_OPTIONS.map((option) => {
                const selected = option.id === "dark";

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`appearance-card ${selected ? "selected" : ""}`}
                    onClick={() => {
                      if (option.id !== "dark") {
                        setToast(`${option.label} mode is coming soon`);
                      }
                    }}
                  >
                    <div className={`appearance-preview ${option.id}`}>
                      <div className="preview-sidebar" />
                      <div className="preview-content">
                        <span className="preview-line accent" />
                        <span className="preview-line" />
                        <span className="preview-line short" />
                      </div>
                      <span className="preview-icon">
                        <AppearanceIcon id={option.id} />
                      </span>
                    </div>
                    <div className="appearance-copy">
                      <span>{option.label}</span>
                      {selected ? <Check size={12} /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="modal-section">
            <div className="section-label">CroFlux Theme</div>
            <div className="theme-grid">
              {THEMES.map((option) => {
                const selected = option.id === theme;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`theme-option ${selected ? "selected" : ""}`}
                    onClick={() => void setTheme(option.id)}
                  >
                    <span
                      className="theme-dot"
                      style={{ background: option.color }}
                      aria-hidden="true"
                    />
                    <span className="theme-label">{option.label}</span>
                    {selected ? <Check size={13} className="theme-check" /> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="modal-footer">
            <p>Changes apply instantly across CroFlux.</p>
            <button
              type="button"
              className="reset-button"
              disabled={theme === DEFAULT_THEME_ID}
              onClick={() => void setTheme(DEFAULT_THEME_ID)}
            >
              Reset to default
            </button>
          </div>
        </div>
      </div>

      {toast ? <div className="theme-toast">{toast}</div> : null}

      <style jsx>{`
        .theme-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
        }
        .theme-modal {
          position: relative;
          width: min(420px, calc(100vw - 32px));
          border-radius: 16px;
          border: 1px solid var(--border);
          background: #18181f;
          padding: 28px;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7);
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }
        .modal-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }
        .modal-header p {
          margin-top: 4px;
          font-size: 13px;
          color: #52525b;
        }
        .modal-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          background: #2a2a35;
          color: #c8c8d0;
        }
        .modal-section + .modal-section {
          margin-top: 24px;
        }
        .section-label {
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text3);
          font-family: var(--mono);
        }
        .appearance-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .appearance-card {
          border: 2px solid #2a2a35;
          border-radius: 12px;
          background: #121218;
          overflow: hidden;
          transition: border-color 0.3s ease, color 0.3s ease;
        }
        .appearance-card.selected {
          border-color: var(--accent);
        }
        .appearance-preview {
          position: relative;
          display: flex;
          gap: 6px;
          height: 70px;
          padding: 10px;
        }
        .appearance-preview.light {
          background: linear-gradient(135deg, #f2f2f5 0%, #e6e7ec 100%);
        }
        .appearance-preview.dark {
          background: linear-gradient(135deg, #0d0d0f 0%, #14141c 100%);
        }
        .appearance-preview.auto {
          background: linear-gradient(135deg, #f2f2f5 0 50%, #14141c 50% 100%);
        }
        .preview-sidebar {
          width: 18px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
        }
        .appearance-preview.light .preview-sidebar {
          background: #d7dae3;
        }
        .appearance-preview.auto .preview-sidebar {
          background: linear-gradient(180deg, #d7dae3 0 50%, rgba(255, 255, 255, 0.1) 50% 100%);
        }
        .preview-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-top: 2px;
        }
        .preview-line {
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }
        .appearance-preview.light .preview-line {
          background: rgba(26, 26, 37, 0.16);
        }
        .appearance-preview.auto .preview-line {
          background: linear-gradient(90deg, rgba(26, 26, 37, 0.16) 0 50%, rgba(255, 255, 255, 0.16) 50% 100%);
        }
        .preview-line.accent {
          background: var(--accent);
        }
        .preview-line.short {
          width: 62%;
        }
        .preview-icon {
          position: absolute;
          right: 10px;
          bottom: 10px;
          color: rgba(255, 255, 255, 0.7);
        }
        .appearance-preview.light .preview-icon {
          color: #7c7c87;
        }
        .appearance-copy {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 34px;
          border-top: 1px solid #2a2a35;
          color: #b7b7c4;
          font-size: 12px;
          font-weight: 500;
        }
        .appearance-card.selected .appearance-copy {
          color: var(--accent);
        }
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .theme-option {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 42px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #2a2a35;
          background: #111117;
          color: #a1a1aa;
          transition:
            background-color 0.3s ease,
            border-color 0.3s ease,
            color 0.3s ease;
        }
        .theme-option.selected {
          border-color: var(--accent);
          background: var(--accent-subtle);
          color: #fff;
        }
        .theme-dot {
          width: 18px;
          height: 18px;
          border-radius: 6px;
          flex-shrink: 0;
        }
        .theme-label {
          flex: 1;
          font-size: 13px;
          text-align: left;
        }
        .theme-check {
          color: var(--accent);
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid #2a2a35;
        }
        .modal-footer p {
          font-size: 12px;
          color: #71717a;
        }
        .reset-button {
          border: 1px solid #2a2a35;
          border-radius: 10px;
          background: #111117;
          color: #d4d4dc;
          font-size: 12px;
          font-weight: 600;
          padding: 9px 12px;
          transition:
            background-color 0.3s ease,
            border-color 0.3s ease,
            color 0.3s ease,
            opacity 0.3s ease;
        }
        .reset-button:hover:not(:disabled) {
          border-color: var(--accent);
          background: var(--accent-subtle);
          color: #fff;
        }
        .reset-button:disabled {
          opacity: 0.45;
          cursor: default;
        }
        .theme-toast {
          position: fixed;
          left: 50%;
          bottom: 24px;
          z-index: 60;
          transform: translateX(-50%);
          border: 1px solid var(--accent-subtle);
          background: #18181f;
          color: #fff;
          border-radius: 12px;
          padding: 10px 14px;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
