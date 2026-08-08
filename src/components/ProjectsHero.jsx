import React from "react";
import { ProjectStatusIcon } from "./Icons.jsx";
import { heroSummary } from "../lib/projectLang.js";

/* ============================================================
   ProjectsHero — a friendly summary, not analytics.
   Mirrors the Ad Grant hero exactly (same classes) so the two
   areas feel like one product.
   ============================================================ */

export default function ProjectsHero({ data }) {
  const summary = heroSummary(data);
  const hasAttention = summary.attention > 0;

  const tone = hasAttention ? "review" : "working";
  const title = hasAttention
    ? `${summary.attention} item${summary.attention === 1 ? "" : "s"} ready for your review`
    : "Nothing needs you right now";
  const cardSummary = hasAttention
    ? "We've finished our part and need your feedback before we can move forward."
    : "We've got things covered. We'll let you know when something is ready for you.";

  return (
    <section className="hero" id="top" aria-labelledby="projects-hero-headline">
      <p className="hero__eyebrow as-eyebrow">Your ActivatUs projects</p>
      <span className="hero__rule" aria-hidden="true" />

      <h1 className="hero__headline" id="projects-hero-headline">
        {summary.headline}
      </h1>
      <p className="hero__lede">
        We'll keep this page updated so you can see what's moving, what's coming
        next, and when we need something from you.
      </p>

      <div className={`hero__status hero__status--${tone}`}>
        <span className="hero__status-icon" aria-hidden="true">
          <ProjectStatusIcon status={tone} size={30} />
        </span>
        <div className="hero__status-body">
          <p className="hero__status-title">{title}</p>
          <p className="hero__status-summary">{summary.sentence}</p>
        </div>
      </div>
    </section>
  );
}
