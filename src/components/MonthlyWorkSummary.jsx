import React from "react";
import { CategoryIcon } from "./Icons.jsx";
import { countByCategory, statusBreakdownText } from "../lib/projectLang.js";

/* ============================================================
   MonthlyWorkSummary — "This month's work".
   The month's work broken down by category (the same friendly
   categories shown in "What we're working on"), each with a count
   and a plain-English status line. Categories with no work are
   omitted rather than shown empty.
   ============================================================ */

export default function MonthlyWorkSummary({ data }) {
  const cats = countByCategory(data);
  if (cats.length === 0) return null;

  return (
    <section className="section" aria-labelledby="month-heading">
      <div className="section__head">
        <h2 className="section__title" id="month-heading">
          This month's work
        </h2>
        <p className="section__intro">
          A quick picture of what's happening across your projects in{" "}
          {data.monthLabel}, grouped by the kind of work.
        </p>
      </div>

      <div className="catsum">
        {cats.map((c) => (
          <div className="catsum__item" key={c.category.key}>
            <span className="catsum__icon" aria-hidden="true">
              <CategoryIcon name={c.category.icon} size={22} />
            </span>
            <div className="catsum__body">
              <div className="catsum__top">
                <span className="catsum__num">{c.total}</span>
                <h3 className="catsum__label">{c.category.label}</h3>
              </div>
              <p className="catsum__status">{statusBreakdownText(c.breakdown)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
