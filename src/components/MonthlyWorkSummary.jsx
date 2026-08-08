import React from "react";
import { workCounts } from "../lib/projectLang.js";

/* ============================================================
   MonthlyWorkSummary — "This month's work".
   Meaningful counts in plain language, not vanity productivity
   statistics. Only shows a figure when it's greater than zero.
   ============================================================ */

export default function MonthlyWorkSummary({ data }) {
  const c = workCounts(data);

  const stats = [
    { n: c.working, label: "Currently being worked on" },
    { n: c.review + c.waiting, label: "Ready for your review" },
    { n: c.upcoming, label: "Coming up next" },
    { n: c.complete, label: "Completed this month" },
  ].filter((s) => s.n > 0);

  if (stats.length === 0) return null;

  return (
    <section className="section" aria-labelledby="month-heading">
      <div className="section__head">
        <h2 className="section__title" id="month-heading">
          This month's work
        </h2>
        <p className="section__intro">
          A quick picture of what's happening across your projects in{" "}
          {data.monthLabel}.
        </p>
      </div>

      <div className="worksum__grid">
        {stats.map((s) => (
          <div className="worksum__item" key={s.label}>
            <div className="worksum__num">{s.n}</div>
            <p className="worksum__label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
