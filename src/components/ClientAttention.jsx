import React, { useState } from "react";
import ProjectStatusBadge from "./ProjectStatusBadge.jsx";
import { ChevronIcon } from "./Icons.jsx";
import { attentionItems, timingLabel } from "../lib/projectLang.js";

/* ============================================================
   ClientAttention — "A quick thing we need from you".
   Appears near the top only when something genuinely needs the
   client. Makes their responsibility unmistakable, with a clear
   action. Warm review treatment, never alarming.
   ============================================================ */

function AttentionCard({ item, project }) {
  const [open, setOpen] = useState(false);
  const d = item.detail || {};
  const panelId = `att-${item.id}`;

  return (
    <div className="attn-card">
      <div className="attn-card__head">
        <div>
          {project ? <p className="attn-card__project">{project.name}</p> : null}
          <h3 className="attn-card__title">{item.title}</h3>
        </div>
        <ProjectStatusBadge state={item.state} />
      </div>

      <p className="attn-card__desc">{item.description}</p>

      <div className="attn-card__actions">
        <button type="button" className="as-btn as-btn-primary">
          Review this
        </button>
        {d.files && d.files.length ? (
          <button
            type="button"
            className="as-btn as-btn-outline"
            onClick={() => setOpen(true)}
          >
            View files
          </button>
        ) : null}
        {item.timing ? (
          <span className="attn-card__meta">{timingLabel(item.timing)}</span>
        ) : null}
      </div>

      {(d.next || (d.files && d.files.length) || (d.notes && d.notes.length)) ? (
        <div className="attn-card__more">
          <button
            type="button"
            className="link-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide details" : "See details"}
            <ChevronIcon open={open} size={18} />
          </button>

          <div className="attn-card__detail" id={panelId} hidden={!open}>
            {d.next ? (
              <div className="mini-block">
                <h4>What happens next</h4>
                <p>{d.next}</p>
              </div>
            ) : null}
            {d.files && d.files.length ? (
              <div className="mini-block">
                <h4>Files for you</h4>
                <ul className="plain-list">
                  {d.files.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {d.notes && d.notes.length ? (
              <div className="mini-block">
                <h4>Notes for you</h4>
                {d.notes.map((n, i) => (
                  <p key={i}>{n}</p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ClientAttention({ data }) {
  const items = attentionItems(data);
  const projectById = (id) => data.projects.find((p) => p.id === id);

  if (items.length === 0) {
    return (
      <section className="section" aria-labelledby="attn-heading">
        <div className="section__head">
          <h2 className="section__title" id="attn-heading">
            Nothing needed from you right now
          </h2>
          <p className="section__intro">
            We've got things covered. We'll let you know here the moment
            something is ready for your review.
          </p>
        </div>
      </section>
    );
  }

  const count = items.length;

  return (
    <section className="section" aria-labelledby="attn-heading">
      <div className="section__head">
        <h2 className="section__title" id="attn-heading">
          A quick thing we need from you
        </h2>
        <p className="section__intro">
          {count} item{count === 1 ? " is" : "s are"} ready for your review.
          We've finished our part and need your feedback before we can move
          forward.
        </p>
      </div>

      <div className="attn-list">
        {items.map((item) => (
          <AttentionCard
            key={item.id}
            item={item}
            project={projectById(item.projectId)}
          />
        ))}
      </div>

      <p className="attn-else">Nothing else is waiting on you.</p>
    </section>
  );
}
