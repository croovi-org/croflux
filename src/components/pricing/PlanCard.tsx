"use client";

import { ArrowUp, ArrowUpRight, Check, Users } from "lucide-react";
import Link from "next/link";

type Feature = {
  label: string;
  emphasis?: boolean;
};

type PlanCardProps = {
  id: string;
  label: string;
  name: string;
  description: string;
  price: string;
  annualPrice: string;
  annualSavings: string;
  features: Feature[];
  isFeatured?: boolean;
  isTeam?: boolean;
  ctaLabel: string;
  ctaStyle: "secondary" | "accent" | "team-secondary" | "team-primary";
  teamSize?: string;
  perfectFor?: string[];
  includesLabel: string;
  currentPlan?: boolean;
  billingAnnual: boolean;
  badge?: string;
};

export function PlanCard({
  id,
  label,
  name,
  description,
  price,
  annualPrice,
  annualSavings,
  features,
  isFeatured = false,
  isTeam = false,
  ctaLabel,
  ctaStyle,
  teamSize,
  perfectFor,
  includesLabel,
  currentPlan = false,
  billingAnnual,
  badge,
}: PlanCardProps) {
  const accent = isTeam ? "#22d3ee" : "#7c6ef7";
  const accentBorder = isTeam
    ? "rgba(34, 211, 238, 0.34)"
    : "rgba(124, 110, 247, 0.26)";
  const checkTone = isTeam ? "#22c55e" : "#7c6ef7";

  return (
    <article className={`plan-card ${isFeatured ? "featured" : ""} ${isTeam ? "team" : ""}`}>
      {badge ? <div className="top-badge">{badge}</div> : null}

      <div className="plan-top">
        {teamSize ? (
          <div className="team-size">
            <Users size={13} />
            <span>{teamSize}</span>
          </div>
        ) : null}

        <div className="plan-label">{label}</div>
        <h3>{name}</h3>
        <p className="desc">{description}</p>

        <div className="price-wrap">
          <span className="price">{billingAnnual ? annualPrice : price}</span>
          <span className="suffix">/month</span>
        </div>

        <div className={`annual-note ${billingAnnual ? "visible" : ""}`}>
          {annualPrice}/mo billed annually · <span>save {annualSavings}</span>
        </div>

        {currentPlan ? (
          <div className="current-cta">Your current plan — Upgrade</div>
        ) : (
          <Link href={`/api/billing/checkout?plan=${id}`} className={`cta ${ctaStyle}`}>
            {ctaStyle === "secondary" || ctaStyle === "team-secondary" || ctaStyle === "team-primary" ? (
              <ArrowUp size={16} />
            ) : null}
            <span>{ctaLabel}</span>
            {ctaStyle === "accent" ? <ArrowUpRight size={14} /> : null}
          </Link>
        )}
      </div>

      <div className="divider" />

      <div className="plan-body">
        <div className="includes">{includesLabel}</div>
        <ul className="feature-list">
          {features.map((feature) => (
            <li key={feature.label}>
              <span className="check-wrap">
                <Check size={11} />
              </span>
              <span className={feature.emphasis ? "emphasis" : ""}>{feature.label}</span>
            </li>
          ))}
        </ul>

        {perfectFor?.length ? (
          <div className="perfect-box">
            <div className="perfect-title">Perfect for</div>
            <div className="perfect-list">
              {perfectFor.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .plan-card {
          position: relative;
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 14px;
          overflow: hidden;
          min-height: 100%;
          transition: border-color 0.15s ease;
        }
        .plan-card:hover {
          border-color: #2e2e48;
        }
        .plan-card.featured {
          border: 1.5px solid rgba(124, 110, 247, 0.92);
        }
        .plan-card.team {
          border-color: rgba(34, 211, 238, 0.2);
        }
        .plan-card.team:hover {
          border-color: rgba(34, 211, 238, 0.4);
        }
        .top-badge {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          min-width: 160px;
          height: 30px;
          padding: 0 16px;
          border-radius: 0 0 8px 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${isTeam ? "#22d3ee" : "#7c6ef7"};
          color: ${isTeam ? "#0f0f17" : "#ffffff"};
          font-size: 10px;
          font-weight: 600;
          font-family: "Geist Mono", monospace;
          letter-spacing: 0.06em;
        }
        .plan-top {
          padding: ${badge ? "36px 22px 18px" : "24px 22px 18px"};
        }
        .team-size {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 22px;
          padding: 0 9px;
          border-radius: 4px;
          border: 1px solid ${accentBorder};
          background: ${isTeam ? "rgba(34, 211, 238, 0.08)" : "rgba(124, 110, 247, 0.08)"};
          color: ${accent};
          font-size: 10px;
          font-family: "Geist Mono", monospace;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .plan-label {
          color: ${accent};
          font-size: 10px;
          font-weight: 600;
          font-family: "Geist Mono", monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
          color: #f0f0f8;
        }
        .desc {
          margin: 6px 0 0;
          min-height: 34px;
          font-size: 11px;
          line-height: 1.5;
          color: #7b7f99;
          max-width: 42ch;
        }
        .price-wrap {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          margin-top: 18px;
        }
        .price {
          font-family: "Geist Mono", monospace;
          font-size: 32px;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #f4f5fb;
        }
        .suffix {
          font-size: 12px;
          color: #6f7390;
          margin-bottom: 2px;
        }
        .annual-note {
          margin-top: 4px;
          min-height: 14px;
          font-size: 10px;
          color: #6f7390;
          font-family: "Geist Mono", monospace;
          opacity: 0;
          transition: opacity 0.16s ease;
        }
        .annual-note.visible {
          opacity: 1;
        }
        .annual-note span {
          color: #22c55e;
        }
        :global(a.cta),
        .current-cta {
          width: 100%;
          margin-top: 18px;
          min-height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          box-sizing: border-box;
        }
        :global(a.cta) {
          border: 1px solid #2e2e48;
          background: #1a1a28;
          color: #9a9fb9;
          cursor: pointer;
          font-family: Inter, system-ui, sans-serif;
          transition: all 0.15s ease;
        }
        :global(a.cta.secondary:hover) {
          border-color: #7c6ef7;
          color: #7c6ef7;
        }
        :global(a.cta.accent) {
          background: #7c6ef7;
          color: #ffffff;
          border-color: #7c6ef7;
        }
        :global(a.cta.accent:hover) {
          background: #6357d4;
          border-color: #6357d4;
        }
        :global(a.cta.team-secondary) {
          background: rgba(34, 211, 238, 0.08);
          color: #22d3ee;
          border-color: rgba(34, 211, 238, 0.2);
        }
        :global(a.cta.team-secondary:hover) {
          background: rgba(34, 211, 238, 0.12);
        }
        :global(a.cta.team-primary) {
          background: #22d3ee;
          color: #04342c;
          border-color: #22d3ee;
        }
        :global(a.cta.team-primary:hover) {
          opacity: 0.9;
        }
        :global(a.cta svg) {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .current-cta {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.26);
          color: #22c55e;
        }
        .divider {
          margin: 0 22px;
          height: 1px;
          background: #252538;
        }
        .plan-body {
          padding: 18px 22px;
          flex: 1;
        }
        .includes {
          color: #676b86;
          font-size: 10px;
          font-weight: 500;
          margin-bottom: 10px;
          font-family: "Geist Mono", monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0;
        }
        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 5px 0;
          color: #b3b7cb;
          font-size: 12px;
          line-height: 1.4;
        }
        .check-wrap {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          margin-top: 1px;
          background: ${isTeam ? "rgba(34, 197, 94, 0.08)" : "rgba(124, 110, 247, 0.08)"};
          border: 1px solid ${isTeam ? "rgba(34, 197, 94, 0.24)" : accentBorder};
          color: ${checkTone};
          flex-shrink: 0;
        }
        .emphasis {
          font-weight: 500;
          color: #f2f3f8;
        }
        .perfect-box {
          margin-top: 14px;
          border-radius: 8px;
          border: 1px solid #252538;
          background: #1a1a28;
          padding: 10px 12px;
        }
        .perfect-title {
          color: #676b86;
          font-size: 10px;
          font-weight: 500;
          margin-bottom: 8px;
          font-family: "Geist Mono", monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .perfect-list {
          display: grid;
          gap: 3px;
        }
        .perfect-list span {
          position: relative;
          padding-left: 12px;
          color: #a0a4ba;
          font-size: 11px;
          line-height: 1.35;
        }
        .perfect-list span::before {
          content: "•";
          position: absolute;
          left: 0;
          top: 0;
          color: #70748d;
        }
      `}</style>
    </article>
  );
}
