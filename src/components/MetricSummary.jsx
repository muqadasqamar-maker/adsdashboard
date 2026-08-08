import React from "react";
import MetricItem from "./MetricItem.jsx";
import { group, whole, percent, inEveryHundred } from "../lib/format.js";

/* ============================================================
   MetricSummary — "What your ads are doing".
   The three or four numbers the client actually cares about,
   translated out of Google Ads vocabulary.
   ============================================================ */

export default function MetricSummary({ performance }) {
  const p = performance;

  const metrics = [
    {
      value: group(p.impressions),
      title: "People saw your ads",
      caption: "Times your ads appeared in Google this month.",
    },
    {
      value: group(p.clicks),
      title: "People visited from your ads",
      caption: "People who clicked through to you this month.",
    },
    {
      value: whole(p.conversions),
      title: "Meaningful actions",
      caption: "Important actions people took because of your ads this month.",
      note:
        "These are actions you've asked us to track, such as sign-ups, registrations, or other important steps.",
    },
    {
      value: percent(p.ctr),
      title: "People responding to your ads",
      caption: `About ${inEveryHundred(
        p.ctr
      )} people who saw your ads clicked.`,
    },
  ];

  return (
    <section className="section metrics" aria-labelledby="metrics-heading">
      <div className="section__head">
        <h2 className="section__title" id="metrics-heading">
          What your ads are doing
        </h2>
        <p className="section__intro">
          A simple summary of your Google Ad Grant so far this month.
        </p>
      </div>

      <div className="metrics__grid">
        {metrics.map((m) => (
          <MetricItem key={m.title} {...m} />
        ))}
      </div>
    </section>
  );
}
