"use client";

import { ArrowUpRight, Check, Users } from "lucide-react";
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
  ctaStyle: "secondary" | "accent" | "teal";
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
  const accentDim = isTeam ? "rgba(34, 211, 238, 0.1)" : "rgba(124, 110, 247, 0.08)";
  const accentBorder = isTeam ? "rgba(34, 211, 238, 0.28)" : "rgba(124, 110, 247, 0.22)";

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

        <div className="price-row">
          <span className="price">{billingAnnual ? annualPrice : price}</span>
          <span className="suffix">/month</span>
        </div>

        <div className={`annual-note ${billingAnnual ? "visible" : ""}`}>
          {annualPrice}/mo billed annually · save {annualSavings}
        </div>

        {currentPlan ? (
          <div className="current-cta">
            <span className="current-dot" />
            <span>Your current plan — Upgrade</span>
          </div>
        ) : (
          <Link
            href={`/api/billing/checkout?plan=${id}`}
            className={`cta ${ctaStyle}`}
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight size={14} />
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
          border-radius: 12px;
          padding: 18px;
          overflow: hidden;
        }
        .plan-card.featured {
          border-color: rgba(124, 110, 247, 0.42);
          border-width: 1.5px;
        }
        .plan-card.team {
          border-color: rgba(34, 211, 238, 0.3);
        }
        .top-badge {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          height: 22px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${isTeam ? "#22d3ee" : "#7c6ef7"};
          color: ${isTeam ? "#0f0f17" : "#ffffff"};
          font-size: 10px;
          font-weight: 600;
        }
        .plan-top {
          padding-top: ${badge ? "30px" : "0"};
        }
        .team-size {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid ${accentBorder};
          background: ${accentDim};
          color: ${accent};
          font-size: 10px;
          font-family: "Geist Mono", monospace;
          margin-bottom: 12px;
        }
        .plan-label {
          color: ${accent};
          font-size: 10px;
          font-family: "Geist Mono", monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
          color: #f0f0f8;
        }
        .desc {
          margin: 8px 0 0;
          min-height: 38px;
          font-size: 13px;
          line-height: 1.5;
          color: #7c829b;
        }
        .price-row {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          margin-top: 16px;
        }
        .price {
          font-family: "Geist Mono", monospace;
          font-size: 34px;
          line-height: 1;
          color: #f4f5fb;
        }
        .suffix {
          font-size: 12px;
          color: #7c829b;
          margin-bottom: 4px;
        }
        .annual-note {
          margin-top: 8px;
          min-height: 16px;
          opacity: 0;
          font-size: 11px;
          color: #7c829b;
          font-family: "Geist Mono", monospace;
          transition: opacity 0.16s ease;
        }
        .annual-note.visible {
          opacity: 1;
        }
        .cta,
        .current-cta {
          width: 100%;
          margin-top: 16px;
          min-height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }
        .cta {
          border: 1px solid #252538;
          color: #f0f0f8;
          transition: border-color 0.14s ease, color 0.14s ease, background 0.14s ease;
        }
        .cta.secondary {
          background: #1a1a28;
        }
        .cta.secondary:hover {
          border-color: rgba(124, 110, 247, 0.22);
          color: #8f84ff;
        }
        .cta.accent {
          background: rgba(124, 110, 247, 0.12);
          border-color: rgba(124, 110, 247, 0.24);
          color: #9489ff;
        }
        .cta.accent:hover {
          background: rgba(124, 110, 247, 0.18);
        }
        .cta.teal {
          background: ${isTeam && badge ? "#22d3ee" : "rgba(34, 211, 238, 0.08)"};
          border-color: rgba(34, 211, 238, 0.24);
          color: ${isTeam && badge ? "#0f0f17" : "#22d3ee"};
        }
        .cta.teal:hover {
          background: ${isTeam && badge ? "#3be1f2" : "rgba(34, 211, 238, 0.14)"};
        }
        .current-cta {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.24);
          color: #22c55e;
          justify-content: center;
        }
        .current-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
        }
        .divider {
          margin: 16px 0;
          height: 1px;
          background: #252538;
        }
        .includes {
          color: #d3d5e1;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 9px;
        }
        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #d9dbe8;
          font-size: 13px;
          line-height: 1.45;
        }
        .check-wrap {
          width: 17px;
          height: 17px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          margin-top: 1px;
          background: ${accentDim};
          border: 1px solid ${accentBorder};
          color: ${accent};
          flex-shrink: 0;
        }
        .emphasis {
          font-weight: 700;
          color: #f2f3f8;
        }
        .perfect-box {
          margin-top: 16px;
          border-radius: 10px;
          border: 1px solid ${accentBorder};
          background: ${accentDim};
          padding: 12px;
        }
        .perfect-title {
          color: #f0f0f8;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .perfect-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .perfect-list span {
          height: 22px;
          padding: 0 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #252538;
          background: #1a1a28;
          color: #8e93ad;
          font-size: 10px;
          font-family: "Geist Mono", monospace;
        }
      `}</style>
    </article>
  );
}
