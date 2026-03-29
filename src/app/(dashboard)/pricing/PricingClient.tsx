"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Box, Shield } from "lucide-react";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PlanCard } from "@/components/pricing/PlanCard";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type SidebarMilestone = {
  id: string;
  title: string;
  progress: number;
  state: "active" | "locked" | "done";
};

type ShellProps = {
  workspaceName: string;
  initials: string;
  userName: string;
  nextUpTask: string | null;
  nextUpContext: string | null;
  incompleteTaskCount: number;
  rank: number | null;
  milestones: SidebarMilestone[];
  streak: number;
};

type PricingClientProps = {
  shell: ShellProps;
  currentPlan: string;
};

function SectionLabel({ label, tone = "accent" }: { label: string; tone?: "accent" | "teal" }) {
  return (
    <div className={`section-label ${tone}`}>
      <span className="line" />
      <span className="text">{label}</span>
      <span className="line" />

      <style jsx>{`
        .section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          justify-content: center;
          margin: 6px 0 18px;
        }
        .line {
          width: 96px;
          height: 1px;
          background: #252538;
        }
        .text {
          font-size: 11px;
          font-family: "Geist Mono", monospace;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: ${tone === "teal" ? "#22d3ee" : "#7c6ef7"};
        }
      `}</style>
    </div>
  );
}

export function PricingClient({ shell, currentPlan }: PricingClientProps) {
  const [annual, setAnnual] = useState(true);

  const normalizedPlan = useMemo(() => currentPlan || "free", [currentPlan]);

  return (
    <WorkspaceShell
      workspaceName={shell.workspaceName}
      currentPage="Pricing"
      currentSection="/pricing"
      initials={shell.initials}
      userName={shell.userName}
      nextUpTask={shell.nextUpTask}
      nextUpContext={shell.nextUpContext}
      incompleteTaskCount={shell.incompleteTaskCount}
      rank={shell.rank}
      milestones={shell.milestones}
      streak={shell.streak}
    >
      <main className="pricing-main">
        <div className="pricing-wrap">
          <header className="pricing-header">
            <div className="eyebrow">Choose your plan</div>
            <h1>
              Simple pricing for
              <span> serious builders</span>
            </h1>
            <p>
              Pick a plan that fits your execution style now, then scale into team workflows
              when CroFlux becomes your operating system.
            </p>

            <div className="current-strip">
              <span className="dot" />
              <span>Current plan: Early Access — Free (beta)</span>
            </div>

            <BillingToggle annual={annual} onChange={setAnnual} />
          </header>

          <SectionLabel label="Solo builders" />

          <section className="plan-grid">
            <PlanCard
              id="builder"
              label="Solo builder"
              name="Builder"
              description="Best for most solo builders. Everything you need to ship consistently."
              price="$12"
              annualPrice="$9.60"
              annualSavings="$29"
              features={[
                { label: "3 projects", emphasis: true },
                { label: "10 AI roadmap generations / month" },
                { label: "Unlimited tasks" },
                { label: "Progress tracking" },
                { label: "Builder streak" },
                { label: "Weekly leaderboard" },
                { label: "Boss milestones" },
                { label: "Editable roadmap" },
              ]}
              isFeatured
              badge="Most popular"
              ctaLabel="Your current plan — Upgrade"
              ctaStyle="accent"
              perfectFor={["1 main startup", "1–2 side ideas"]}
              includesLabel="What's included"
              currentPlan
              billingAnnual={annual}
            />

            <PlanCard
              id="pro-builder"
              label="Solo builder"
              name="Pro Builder"
              description="For serious builders shipping multiple products at once."
              price="$24"
              annualPrice="$19.20"
              annualSavings="$57"
              features={[
                { label: "Unlimited projects", emphasis: true },
                { label: "25 AI roadmap generations / month" },
                { label: "Roadmap refinement AI" },
                { label: "Advanced analytics — execution insights" },
                { label: "Export roadmap" },
                { label: "Priority AI processing" },
              ]}
              ctaLabel="Upgrade to Pro"
              ctaStyle="secondary"
              includesLabel="Everything in Builder, plus"
              currentPlan={normalizedPlan === "pro-builder"}
              billingAnnual={annual}
            />
          </section>

          <SectionLabel label="Team builders" tone="teal" />

          <section className="plan-grid">
            <PlanCard
              id="team-starter"
              label="Team"
              name="Team Starter"
              description="For early teams that want one shared operating system across shipping."
              price="$39"
              annualPrice="$31.20"
              annualSavings="$93"
              features={[
                { label: "3 team members", emphasis: true },
                { label: "Shared workspace" },
                { label: "Role-based access" },
                { label: "Team progress dashboard" },
                { label: "Activity timeline" },
                { label: "60 AI roadmap generations / month" },
              ]}
              isTeam
              ctaLabel="Upgrade to Team"
              ctaStyle="team-secondary"
              teamSize="Up to 3 members"
              includesLabel="Everything in Pro Builder, plus"
              currentPlan={normalizedPlan === "team-starter"}
              billingAnnual={annual}
            />

            <PlanCard
              id="team-pro"
              label="Team"
              name="Team Pro"
              description="For focused product teams scaling execution across multiple active bets."
              price="$79"
              annualPrice="$63.20"
              annualSavings="$190"
              features={[
                { label: "15 team members", emphasis: true },
                { label: "Unlimited projects", emphasis: true },
                { label: "150 AI roadmap generations / month" },
                { label: "Advanced analytics" },
                { label: "Roadmap history tracking" },
                { label: "Priority support" },
                { label: "Future API access" },
              ]}
              isTeam
              badge="Best for scale"
              ctaLabel="Upgrade to Team Pro"
              ctaStyle="team-primary"
              teamSize="Up to 15 members"
              includesLabel="Everything in Team Starter, plus"
              currentPlan={normalizedPlan === "team-pro"}
              billingAnnual={annual}
            />
          </section>

          <section className="footer-block">
            <div className="trust-grid">
              <div className="trust-card">
                <Shield size={16} />
                <div>
                  <strong>Cancel anytime</strong>
                  <span>No long-term contracts</span>
                </div>
              </div>
              <div className="trust-card">
                <Box size={16} />
                <div>
                  <strong>Early access pricing</strong>
                  <span>Locked-in launch price</span>
                </div>
              </div>
              <div className="trust-card">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Free tier stays free</strong>
                  <span>Beta users keep access</span>
                </div>
              </div>
            </div>

            <div className="enterprise-row">
              <div>
                <h2>Need something custom?</h2>
                <p>Talk to us about larger teams, custom onboarding, or an early enterprise setup.</p>
              </div>
              <a href="/contact" className="enterprise-btn">
                Contact us
              </a>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .pricing-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: #0f0f17;
        }
        .pricing-wrap {
          padding: 24px 28px 40px;
          max-width: 1368px;
          margin: 0 auto;
        }
        .pricing-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 28px;
        }
        .eyebrow {
          color: #7c6ef7;
          font-size: 11px;
          font-family: "Geist Mono", monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        h1 {
          margin: 14px 0 10px;
          max-width: 560px;
          color: #f1f2f7;
          font-size: 26px;
          line-height: 1.1;
          font-weight: 600;
        }
        h1 span {
          color: #7c6ef7;
        }
        .pricing-header p {
          margin: 0;
          max-width: 480px;
          color: #747a95;
          font-size: 14px;
          line-height: 1.6;
        }
        .current-strip {
          margin-top: 16px;
          height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.22);
          color: #22c55e;
          font-size: 12px;
          font-weight: 500;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
        }
        :global(.billing-toggle) {
          margin-top: 18px;
        }
        .plan-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 36px;
          align-items: start;
        }
        .footer-block {
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid #252538;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .trust-card {
          border: 1px solid #252538;
          border-radius: 12px;
          background: #13131e;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #f0f0f8;
        }
        .trust-card :global(svg) {
          width: 16px;
          height: 16px;
          color: #7c6ef7;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .trust-card strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
        }
        .trust-card span {
          display: block;
          margin-top: 4px;
          color: #747a95;
          font-size: 12px;
        }
        .enterprise-row {
          margin-top: 16px;
          border: 1px solid #252538;
          border-radius: 12px;
          background: #13131e;
          padding: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .enterprise-row h2 {
          margin: 0;
          font-size: 16px;
          color: #f0f0f8;
        }
        .enterprise-row p {
          margin: 6px 0 0;
          color: #747a95;
          font-size: 13px;
        }
        .enterprise-btn {
          flex-shrink: 0;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid rgba(124, 110, 247, 0.24);
          background: rgba(124, 110, 247, 0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #9489ff;
          font-size: 13px;
          font-weight: 600;
        }
        @media (max-width: 1080px) {
          .plan-grid,
          .trust-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 760px) {
          .pricing-wrap {
            padding: 20px 16px 32px;
          }
          .enterprise-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </WorkspaceShell>
  );
}
