import React, { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import { StatusIcon, ChevronIcon } from "./Icons.jsx";

/* ============================================================
   HealthCheckRow — one editorial row (brand rule 5: rows, not a
   card grid). Leading status symbol, plain title + one sentence,
   trailing status word, optional "See details" expansion.
   ============================================================ */

export default function HealthCheckRow({ check }) {
  const [open, setOpen] = useState(false);
  const { content, state } = check;
  const details = content.details || [];
  const hasDetails = details.length > 0;
  const panelId = `hc-${check.key}`;

  return (
    <div className={`hcrow ${open ? "is-open" : ""}`}>
      <div className="hcrow__main">
        <span className={`hcrow__mark hcrow__mark--${state}`} aria-hidden="true">
          <StatusIcon status={state} size={24} />
        </span>

        <div className="hcrow__text">
          <h3 className="hcrow__title">{content.title}</h3>
          <p className="hcrow__desc">{content.explanation}</p>
        </div>

        <div className="hcrow__side">
          <StatusBadge status={state} />
          {hasDetails ? (
            <button
              type="button"
              className="hcrow__toggle"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Hide details" : "See details"}
              <ChevronIcon open={open} size={18} />
            </button>
          ) : null}
        </div>
      </div>

      {hasDetails ? (
        <div className="hcrow__details" id={panelId} hidden={!open}>
          <dl className="detail-list">
            {details.map((d, i) => (
              <div className="detail-list__item" key={d.label + i}>
                <dt>{d.label}</dt>
                {d.value !== "" ? <dd>{d.value}</dd> : null}
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
