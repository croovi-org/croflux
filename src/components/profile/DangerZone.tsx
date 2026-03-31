"use client";

import { LogOut } from "lucide-react";
import { useSignOut } from "@/lib/auth/useSignOut";

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
  const { signOut, isSigningOut } = useSignOut();

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

      <div className="signout-section">
        <div className="signout-row">
          <div className="signout-info">
            <strong>Sign out</strong>
            <p>End your current session and return to the login page.</p>
          </div>
          <button 
            type="button" 
            className="signout-btn"
            onClick={signOut}
            disabled={isSigningOut}
          >
            <LogOut size={14} />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .danger-card {
          background: #13131e;
          border: 1px solid rgba(239, 68, 68, 0.28);
          border-radius: 12px;
          padding: 12px;
        }
        .danger-head {
          padding: 0 0 10px;
        }
        h2 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #ff5353;
        }
        .danger-head p {
          margin: 0;
          font-size: 11px;
          color: #7b8099;
        }
        .danger-rows {
          display: grid;
          gap: 10px;
        }
        .danger-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #252538;
          background: #1a1a28;
        }
        strong {
          display: block;
          margin-bottom: 4px;
          color: #f0f0f8;
          font-size: 13px;
          font-weight: 600;
        }
        .danger-row p {
          margin: 0;
          color: #6f7590;
          font-size: 11px;
        }
        button {
          min-width: 124px;
          height: 36px;
          padding: 0 12px;
          border-radius: 9px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.04);
          color: #ff5353;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.38);
        }
        .signout-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #252538;
        }
        .signout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #252538;
          background: #1a1a28;
        }
        .signout-info p {
          margin: 0;
          color: #6f7590;
          font-size: 11px;
        }
        .signout-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 124px;
          height: 36px;
          padding: 0 14px;
          border-radius: 9px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #f0f0f8;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .signout-btn:hover {
          background: #252538;
          border-color: #353550;
        }
        .signout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
