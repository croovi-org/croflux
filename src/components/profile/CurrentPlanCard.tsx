"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function CurrentPlanCard() {
  const router = useRouter();

  return (
    <section className="section-card">
      <div className="plan-head">
        <div className="plan-copy">
          <div className="plan-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h2>Early Access — Free</h2>
            <p>Beta access for early builders shaping CroFlux with us.</p>
          </div>
        </div>
        <div className="price">$0 / month</div>
      </div>

      <div className="features-box">
        <ul>
          <li>Full dashboard workspace access</li>
          <li>Roadmap and boss milestone progression</li>
          <li>Priority product feedback loop</li>
          <li>Early integrations and launch updates</li>
        </ul>
      </div>

      <button
        type="button"
        className="pricing-btn"
        onClick={() => router.push("/pricing")}
      >
        View pricing plans
      </button>

      <style jsx>{`
        .section-card {
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 14px;
          padding: 14px 16px 16px;
        }
        .plan-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .plan-copy {
          display: flex;
          gap: 12px;
          min-width: 0;
        }
        .plan-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: var(--accent);
          background: var(--accent-subtle);
          border: 1px solid var(--purple-border);
          flex-shrink: 0;
        }
        .plan-icon :global(svg) {
          width: 15px;
          height: 15px;
        }
        h2 {
          margin: 0 0 2px;
          font-size: 15px;
          font-weight: 600;
          color: #f0f0f8;
          line-height: 1.12;
        }
        p {
          margin: 0;
          font-size: 11px;
          line-height: 1.45;
          color: #747a95;
        }
        .price {
          padding-top: 2px;
          font-size: 14px;
          font-family: "Geist Mono", monospace;
          color: #f0f0f8;
          white-space: nowrap;
          line-height: 1.1;
        }
        .features-box {
          border: 1px solid #252538;
          border-radius: 12px;
          background: #1a1a28;
          padding: 12px 14px;
          margin-bottom: 14px;
        }
        ul {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 8px;
          color: #8a8fa8;
          font-size: 11px;
          line-height: 1.35;
        }
        .pricing-btn {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--purple-border);
          background: var(--accent-subtle);
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          white-space: nowrap;
          appearance: none;
          transform: translateY(0);
          transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            border-color 0.16s ease,
            background 0.16s ease,
            color 0.16s ease;
        }
        .pricing-btn:hover {
          transform: translateY(-2px);
          background: var(--accent-subtle);
          border-color: var(--purple-border);
          color: var(--accent);
          box-shadow:
            0 8px 18px rgba(8, 8, 14, 0.14),
            0 0 18px -10px var(--accent-muted);
        }
        @media (max-width: 900px) {
          .section-card {
            padding: 14px;
          }
          .plan-head {
            flex-direction: column;
            gap: 12px;
          }
          .plan-copy {
            gap: 12px;
          }
          .plan-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .plan-icon :global(svg) {
            width: 14px;
            height: 14px;
          }
          h2 {
            font-size: 15px;
          }
          p,
          ul {
            font-size: 11px;
          }
          .features-box {
            padding: 12px 14px;
            border-radius: 10px;
          }
          .pricing-btn {
            height: 42px;
            border-radius: 10px;
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}
