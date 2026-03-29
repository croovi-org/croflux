"use client";

type BillingToggleProps = {
  annual: boolean;
  onChange: (annual: boolean) => void;
};

export function BillingToggle({ annual, onChange }: BillingToggleProps) {
  return (
    <div className="billing-toggle">
      <button
        type="button"
        className={`mode ${!annual ? "active" : ""}`}
        onClick={() => onChange(false)}
      >
        Monthly
      </button>

      <button
        type="button"
        className={`switch ${annual ? "annual" : "monthly"}`}
        aria-label="Toggle billing period"
        aria-pressed={annual}
        onClick={() => onChange(!annual)}
      >
        <span className="thumb" />
      </button>

      <div className="annual-wrap">
        <button
          type="button"
          className={`mode ${annual ? "active" : ""}`}
          onClick={() => onChange(true)}
        >
          Annual
        </button>
        <span className="save-pill">Save 20%</span>
      </div>

      <style jsx>{`
        .billing-toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid #252538;
          background: #13131e;
        }
        .mode {
          border: 0;
          background: transparent;
          color: #737894;
          font-size: 13px;
          font-weight: 500;
          padding: 0;
          cursor: pointer;
          transition: color 0.14s ease;
        }
        .mode.active {
          color: #f0f0f8;
        }
        .switch {
          width: 44px;
          height: 24px;
          border: 1px solid rgba(124, 110, 247, 0.26);
          border-radius: 999px;
          background: rgba(124, 110, 247, 0.18);
          padding: 2px;
          position: relative;
          cursor: pointer;
          transition: background 0.16s ease, border-color 0.16s ease;
        }
        .switch.monthly {
          background: #1a1a28;
          border-color: #252538;
        }
        .thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          display: block;
          background: #7c6ef7;
          transform: translateX(20px);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .switch.monthly .thumb {
          transform: translateX(0);
          background: #8b90a8;
        }
        .annual-wrap {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .save-pill {
          height: 20px;
          padding: 0 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.24);
          color: #22c55e;
          font-size: 10px;
          font-family: "Geist Mono", monospace;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
