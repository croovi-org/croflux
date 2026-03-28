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
        <p>These actions are permanent and cannot be undone. Please read carefully before proceeding.</p>
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
          border: 1px solid rgba(239, 68, 68, 0.28);
          border-radius: 12px;
          padding: 16px;
        }
        .danger-head {
          padding: 0 0 14px;
        }
        h2 {
          margin: 0 0 4px;
          font-size: 16px;
          color: #ff5353;
        }
        .danger-head p {
          margin: 0;
          font-size: 12px;
          color: #7b8099;
        }
        .danger-rows {
          display: grid;
          gap: 14px;
        }
        .danger-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 14px;
          border: 1px solid #252538;
          background: #1a1a28;
        }
        strong {
          display: block;
          margin-bottom: 6px;
          color: #f0f0f8;
          font-size: 15px;
          font-weight: 600;
        }
        .danger-row p {
          margin: 0;
          color: #6f7590;
          font-size: 12px;
        }
        button {
          min-width: 148px;
          height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.04);
          color: #ff5353;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.38);
        }
      `}</style>
    </section>
  );
}
