import React from "react";
import { group, daysAgoPhrase } from "../lib/format.js";

/* ============================================================
   ManagementActivity — "Your account is being actively managed".
   The visual proof that someone is really working on the account.
   One proud number, warm supporting line. No internal IDs, no raw
   timestamps.
   ============================================================ */

export default function ManagementActivity({ management }) {
  return (
    <section className="section managed" aria-labelledby="managed-heading">
      <div className="managed__inner">
        <div className="managed__text">
          <p className="as-eyebrow managed__eyebrow">Looking after your grant</p>
          <h2 className="section__title" id="managed-heading">
            Your account is being actively managed
          </h2>
          <p className="managed__lede">
            We regularly review and improve your account so your grant keeps
            working. The most recent change was {daysAgoPhrase(management.lastChangeDaysAgo)}.
          </p>
        </div>

        <div className="managed__stat">
          <div className="managed__number">{group(management.recentChanges)}</div>
          <p className="managed__label">recent account changes</p>
        </div>
      </div>
    </section>
  );
}
