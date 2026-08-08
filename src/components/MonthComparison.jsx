import React from "react";
import { whole, percent } from "../lib/format.js";

/* ============================================================
   MonthComparison — this month vs last month, made safe to read.
   The sample is early in the month, so we protect the client from
   drawing a false "we fell off a cliff" conclusion. No scary red
   percentage drops without context.
   ============================================================ */

function rateSentence(now, last) {
  if (now == null || last == null) return null;
  const diff = now - last;
  if (Math.abs(diff) <= 1) {
    return "People are responding at about the same rate as last month.";
  }
  if (diff > 0) {
    return "People are responding a little more often than last month.";
  }
  return "People are responding slightly less often than last month.";
}

export default function MonthComparison({ performance, lastMonth }) {
  const day = performance.dayOfMonth;

  return (
    <section className="section compare" aria-labelledby="compare-heading">
      <div className="section__head">
        <h2 className="section__title" id="compare-heading">
          This month compared with last month
        </h2>
        <p className="section__intro">
          A gentle comparison. It's only day {day} of the month, so this isn't a
          like-for-like comparison yet. Full months tell the real story.
        </p>
      </div>

      <div className="compare__grid">
        {/* Meaningful actions */}
        <div className="compare__card">
          <h3 className="compare__label">Meaningful actions</h3>
          <div className="compare__pair">
            <div className="compare__now">
              <span className="compare__num">{whole(performance.conversions)}</span>
              <span className="compare__when">this month so far</span>
            </div>
            <div className="compare__then">
              <span className="compare__num compare__num--muted">
                {whole(lastMonth.conversions)}
              </span>
              <span className="compare__when">all of last month</span>
            </div>
          </div>
          <p className="compare__note">
            We're only {day} days in, so a smaller number here is expected. The
            month is still building.
          </p>
        </div>

        {/* Response rate */}
        <div className="compare__card">
          <h3 className="compare__label">How often people respond</h3>
          <div className="compare__pair">
            <div className="compare__now">
              <span className="compare__num">{percent(performance.ctr)}</span>
              <span className="compare__when">this month</span>
            </div>
            <div className="compare__then">
              <span className="compare__num compare__num--muted">
                {percent(lastMonth.ctr)}
              </span>
              <span className="compare__when">last month</span>
            </div>
          </div>
          <p className="compare__note">
            {rateSentence(performance.ctr, lastMonth.ctr)}
          </p>
        </div>
      </div>
    </section>
  );
}
