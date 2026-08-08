import React from "react";
import { CheckIcon } from "./Icons.jsx";

/* ============================================================
   ProjectProgress — a simple, translated project-level view.
   A plain milestone sequence with the current stage marked, plus
   a one-line "where things stand" note. No subtask counts as the
   primary representation.
   ============================================================ */

function Milestone({ m, isLast }) {
  return (
    <li className={`milestone milestone--${m.state}`}>
      <span className="milestone__dot" aria-hidden="true">
        {m.state === "done" ? <CheckIcon size={16} /> : null}
      </span>
      <span className="milestone__name">{m.name}</span>
      {m.state === "current" ? (
        <span className="milestone__here">We're here</span>
      ) : null}
      {!isLast ? <span className="milestone__line" aria-hidden="true" /> : null}
    </li>
  );
}

export default function ProjectProgress({ projects }) {
  const withProgress = projects.filter((p) => p.progress);
  if (withProgress.length === 0) return null;

  return (
    <section className="section" aria-labelledby="progress-heading">
      <div className="section__head">
        <h2 className="section__title" id="progress-heading">
          Where your projects stand
        </h2>
        <p className="section__intro">
          A simple view of how each project is progressing.
        </p>
      </div>

      <div className="progress-list">
        {withProgress.map((p) => (
          <article className="progress-card" key={p.id}>
            <div className="progress-card__head">
              <h3 className="progress-card__name">{p.name}</h3>
              <span className="progress-card__label">{p.progress.label}</span>
            </div>

            <ol className="milestones" aria-label={`${p.name} stages`}>
              {p.progress.milestones.map((m, i) => (
                <Milestone
                  key={m.name}
                  m={m}
                  isLast={i === p.progress.milestones.length - 1}
                />
              ))}
            </ol>

            <div className="progress-card__note">
              <p className="progress-card__note-title">{p.progress.headline}</p>
              <p className="progress-card__note-body">{p.progress.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
