"use client";

import { Sparkles } from "lucide-react";

export function CurrentPlanCard() {
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

      <button type="button" className="pricing-btn">
        View pricing plans
      </button>

      <style jsx>{`
        .section-card {
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 12px;
          padding: 18px;
        }
        .plan-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .plan-copy {
          display: flex;
          gap: 12px;
        }
        .plan-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: #7c6ef7;
          background: rgba(124, 110, 247, 0.08);
          border: 1px solid rgba(124, 110, 247, 0.22);
          flex-shrink: 0;
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
        .price {
          font-size: 16px;
          font-family: "Geist Mono", monospace;
          color: #f0f0f8;
          white-space: nowrap;
        }
        .features-box {
          border: 1px solid #252538;
          border-radius: 10px;
          background: #1a1a28;
          padding: 14px 14px 14px 18px;
          margin-bottom: 14px;
        }
        ul {
          margin: 0;
          padding-left: 16px;
          display: grid;
          gap: 8px;
          color: #8c90a7;
          font-size: 12px;
        }
        .pricing-btn {
          width: 100%;
          height: 38px;
          border-radius: 8px;
          border: 1px solid rgba(124, 110, 247, 0.24);
          background: rgba(124, 110, 247, 0.08);
          color: #7c6ef7;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
