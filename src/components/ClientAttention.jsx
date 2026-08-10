import React from "react";
import ProjectStatusBadge from "./ProjectStatusBadge.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";
import { attentionItems } from "../lib/projectLang.js";

/* ============================================================
   ClientAttention — "A quick thing we need from you".
   Shows the items that are ready for the client's review, each with
   the feedback controls (review link, note, file, approve).
   ============================================================ */

function AttentionCard({ item, projectName }) {
  return (
    <div className="attn-card">
      <div className="attn-card__head">
        <div>
          {projectName ? <p className="attn-card__project">{projectName}</p> : null}
          <h3 className="attn-card__title">{item.title}</h3>
        </div>
        <ProjectStatusBadge state={item.state} />
      </div>

      <p className="attn-card__desc">{item.description}</p>

      <FeedbackPanel item={item} />
    </div>
  );
}

export default function ClientAttention({ data }) {
  const items = attentionItems(data);
  const projectName = (id) => {
    const p = (data.projects || []).find((x) => x.id === id);
    return p ? p.name : null;
  };

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
            projectName={projectName(item.projectId)}
          />
        ))}
      </div>

      <p className="attn-else">Nothing else is waiting on you.</p>
    </section>
  );
}
