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
          border-radius: 12px;
          padding: 16px;
        }
        .plan-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .plan-copy {
          display: flex;
          gap: 14px;
        }
        .plan-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: #7c6ef7;
          background: rgba(124, 110, 247, 0.08);
          border: 1px solid rgba(124, 110, 247, 0.22);
          flex-shrink: 0;
        }
        h2 {
          margin: 0 0 6px;
          font-size: 17px;
          font-weight: 600;
          color: #f0f0f8;
        }
        p {
          margin: 0;
          font-size: 13px;
          color: #747a95;
        }
        .price {
          font-size: 17px;
          font-family: "Geist Mono", monospace;
          color: #f0f0f8;
          white-space: nowrap;
        }
        .features-box {
          border: 1px solid #252538;
          border-radius: 12px;
          background: #1a1a28;
          padding: 16px 18px;
          margin-bottom: 16px;
        }
        ul {
          margin: 0;
          padding-left: 20px;
          display: grid;
          gap: 10px;
          color: #8a8fa8;
          font-size: 13px;
        }
        .pricing-btn {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(124, 110, 247, 0.24);
          background: rgba(124, 110, 247, 0.08);
          color: #7c6ef7;
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
          background: rgba(124, 110, 247, 0.12);
          border-color: rgba(124, 110, 247, 0.34);
          color: #9186ff;
          box-shadow:
            0 10px 22px rgba(8, 8, 14, 0.18),
            0 0 20px -8px rgba(124, 110, 247, 0.65);
        }
      `}</style>
    </section>
  );
}
