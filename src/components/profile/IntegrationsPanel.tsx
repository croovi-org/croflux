"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock3,
  Github,
  NotebookText,
  Slack,
} from "lucide-react";

type IntegrationStatus = "connected" | "connect" | "soon";

type IntegrationService = {
  name: string;
  description: string;
  features: string[];
  status: IntegrationStatus;
  icon: LucideIcon;
};

type IntegrationsPanelProps = {
  userId: string;
  googleCalendarConnected: boolean;
  googleCalendarTokenExpiry: string | null;
  googleTasklistId: string | null;
};

const services: IntegrationService[] = [
  {
    name: "GitHub",
    description: "Sync repositories, issues, and pull requests with your roadmap.",
    features: ["PR completion", "Issue sync", "Milestones"],
    status: "connect",
    icon: Github,
  },
  {
    name: "Notion",
    description: "Import docs and push status updates back to your operating system.",
    features: ["PDS import", "Sync milestones", "Status push"],
    status: "connect",
    icon: NotebookText,
  },
  {
    name: "Google Calendar",
    description: "Schedule deep-work blocks and align time with task deadlines.",
    features: ["Task blocks", "Deadline reminders", "Two-way sync"],
    status: "connect",
    icon: CalendarDays,
  },
  {
    name: "Apple Calendar",
    description: "Native calendar sync for Apple-first operators.",
    features: ["Event sync", "Focus windows"],
    status: "soon",
    icon: Clock3,
  },
  {
    name: "Slack",
    description: "Push streak updates and important task moments into team chat.",
    features: ["Streak alerts", "Milestone updates"],
    status: "soon",
    icon: Slack,
  },
];

export function IntegrationsPanel({
  userId,
  googleCalendarConnected,
  googleTasklistId,
}: IntegrationsPanelProps) {
  const renderedServices = services.map((service) => {
    if (service.name !== "Google Calendar") {
      return service;
    }

    return {
      ...service,
      status: googleCalendarConnected ? ("connected" as const) : ("connect" as const),
    };
  });

  return (
    <section className="section-card">
      <div className="section-head">
        <div>
          <h2>Integrations</h2>
          <p>Connect the tools around your workspace without leaving the flow.</p>
        </div>
      </div>

      <div className="integration-list">
        {renderedServices.map(({ name, description, features, status, icon: Icon }) => (
          <div key={name} className={`integration-row ${status === "soon" ? "muted" : ""}`}>
            <div className="logo-box">
              <Icon size={18} />
            </div>
            <div className="copy">
              <div className="title-row">
                <h3>{name}</h3>
                <span className={`status ${status}`}>
                  <span className="dot" />
                  {status === "connected"
                    ? "Connected"
                    : status === "connect"
                      ? "Ready to connect"
                      : "Coming soon"}
                </span>
              </div>
              <p>{description}</p>
              {name === "Google Calendar" && googleCalendarConnected && googleTasklistId ? (
                <p className="helper-text">Your Google Tasks are synced</p>
              ) : null}
              <div className="chips">
                {features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </div>
            {name === "Google Calendar" && status === "connect" ? (
              <a
                href={`/api/auth/google-calendar?userId=${userId}`}
                className={`action ${status}`}
              >
                Connect
              </a>
            ) : (
              <button
                type="button"
                className={`action ${status}`}
                disabled={status === "soon" || status === "connected"}
              >
                {status === "connected"
                  ? "Connected"
                  : status === "connect"
                    ? "Connect"
                    : "Coming soon"}
              </button>
            )}
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
        p {
          margin: 0;
          font-size: 12px;
          color: #6f7590;
        }
        .integration-list {
          display: grid;
          gap: 14px;
          padding: 18px;
        }
        .integration-row {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #252538;
          background: #151522;
        }
        .integration-row.muted {
          opacity: 0.55;
        }
        .logo-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #1a1a28;
          border: 1px solid #252538;
          color: #c8ccdb;
        }
        .copy {
          min-width: 0;
        }
        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        h3 {
          margin: 0;
          font-size: 14px;
          color: #f0f0f8;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #8c90a7;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: currentColor;
        }
        .status.connected { color: #22c55e; }
        .status.connect { color: var(--accent); }
        .status.soon { color: #6a7088; }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .helper-text {
          margin-top: 7px;
          font-size: 11px;
          color: #22c55e;
        }
        .chips span {
          height: 26px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #7b819b;
          border: 1px solid #252538;
          background: #1a1a28;
          font-family: "Geist Mono", monospace;
        }
        .action {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #f0f0f8;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .action.connected {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.08);
          border-color: rgba(34, 197, 94, 0.24);
        }
        .action.connect:hover {
          color: var(--accent);
          border-color: var(--purple-border);
        }
        .action.soon {
          color: #6a7088;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
