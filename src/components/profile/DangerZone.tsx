"use client";

const actions = [
  {
    label: "Reset workspace",
    copy: "Clear generated planning artifacts and start your workspace fresh.",
    action: "Reset workspace",
  },
  {
    label: "Delete all data",
    copy: "Remove tasks, milestones, and activity logs from this account.",
    action: "Delete data",
  },
  {
    label: "Delete account",
    copy: "Permanently remove your CroFlux account and all connected workspace data.",
    action: "Delete account",
  },
];

export function DangerZone() {
  return (
    <section className="danger-card">
      <div className="danger-head">
        <h2>Danger zone</h2>
        <p>These actions are destructive. Layout only for now, no destructive logic attached.</p>
      </div>
      <div className="danger-rows">
        {actions.map((item) => (
          <div key={item.label} className="danger-row">
            <div>
              <strong>{item.label}</strong>
              <p>{item.copy}</p>
            </div>
            <button type="button">{item.action}</button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .danger-card {
          background: #13131e;
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: 12px;
        }
        .danger-head {
          padding: 18px;
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
        }
        h2 {
          margin: 0 0 4px;
          font-size: 16px;
          color: #f0f0f8;
        }
        .danger-head p {
          margin: 0;
          font-size: 12px;
          color: #b3848b;
        }
        .danger-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-top: 1px solid rgba(239, 68, 68, 0.12);
        }
        .danger-row:first-child {
          border-top: 0;
        }
        strong {
          display: block;
          margin-bottom: 4px;
          color: #f0f0f8;
          font-size: 14px;
        }
        .danger-row p {
          margin: 0;
          color: #b3848b;
          font-size: 12px;
        }
        button {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.28);
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
