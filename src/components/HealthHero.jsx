import React from "react";
import { StatusIcon } from "./Icons.jsx";
import { STATUS } from "../lib/status.js";

/* ============================================================
   HealthHero — reassurance before numbers.
   Plain-English health summary + one large status indicator
   (icon AND words). Black-on-light; the gradient appears only as
   one slim accent rule, never behind the reading text.
   ============================================================ */

export default function HealthHero({ overall, lastChecked, orgName }) {
  // A "watch" item is something we're monitoring, not something the
  // client must act on, so the hero stays positive. Only a real
  // "action" state changes the headline and the indicator.
  const needsAction = overall.level === "action";
  const tone = needsAction ? "action" : "good";
  const indicatorStatus = needsAction ? "action" : "good";
  const title = needsAction
    ? STATUS.action.label
    : "Looking good";

  const supporting = needsAction
    ? "Your ads are running and we're on top of your account. There's one step we'd like you to take, shown below."
    : "Your ads are running, people are finding you, and we're actively monitoring your account.";

  return (
    <section className="hero" id="top" aria-labelledby="hero-headline">
      <p className="hero__eyebrow as-eyebrow">Your Google Ad Grant</p>
      <span className="hero__rule" aria-hidden="true" />

      <h1 className="hero__headline" id="hero-headline">
        {overall.headline}
      </h1>
      <p className="hero__lede">{supporting}</p>

      <div className={`hero__status hero__status--${tone}`}>
        <span className="hero__status-icon" aria-hidden="true">
          <StatusIcon status={indicatorStatus} size={30} />
        </span>
        <div className="hero__status-body">
          <p className="hero__status-title">{title}</p>
          <p className="hero__status-summary">{overall.summary}</p>
        </div>
        <div className="hero__checked">
          <span className="hero__checked-label">Last checked</span>
          <span className="hero__checked-value">{lastChecked}</span>
        </div>
      </div>
    </section>
  );
}
