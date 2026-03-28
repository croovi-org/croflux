"use client";

const rows = [
  {
    label: "Password",
    copy: "Change your login credentials and keep the workspace secure.",
    action: "Change",
  },
  {
    label: "Two-factor authentication",
    copy: "Add an extra layer of security to your CroFlux account.",
    action: "Enable",
  },
  {
    label: "Active sessions",
    copy: "Review devices currently signed in to your account.",
    action: "Manage",
  },
];

export function SecurityPanel() {
  return (
    <section className="section-card">
      <div className="section-head">
        <div>
          <h2>Security</h2>
          <p>Keep your access safe and review how this workspace is being used.</p>
        </div>
      </div>
      <div className="rows">
        {rows.map((row) => (
          <div key={row.label} className="row">
            <div>
              <strong>{row.label}</strong>
              <p>{row.copy}</p>
            </div>
            <button type="button">{row.action}</button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .section-card {
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 12px;
        }
        .section-head {
          padding: 18px;
          border-bottom: 1px solid #252538;
        }
        h2 {
          margin: 0 0 4px;
          font-size: 16px;
          color: #f0f0f8;
        }
        .section-head p {
          margin: 0;
          font-size: 12px;
          color: #6f7590;
        }
        .rows {
          display: grid;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-top: 1px solid #252538;
        }
        .row:first-child {
          border-top: 0;
        }
        strong {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
          color: #f0f0f8;
        }
        .row p {
          margin: 0;
          color: #7b8099;
          font-size: 12px;
        }
        button {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #f0f0f8;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
