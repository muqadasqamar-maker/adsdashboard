import React, { useState } from "react";
import ProjectStatusBadge from "./ProjectStatusBadge.jsx";
import { ChevronIcon } from "./Icons.jsx";
import { workState, timingLabel } from "../lib/projectLang.js";

/* ============================================================
   WorkItemRow — one piece of work as a spacious editorial row
   (not a task-table row). Shows only what the client needs:
   what it is, a simple status, expected timing, and whether they
   need to do anything. Optional plain-English detail on expand.
   ============================================================ */

export default function WorkItemRow({ item }) {
  const [open, setOpen] = useState(false);
  const s = workState(item.state);
  const d = item.detail || {};
  const hasDetail = !!(d.doing || d.stands || d.next);
  const panelId = `witem-${item.id}`;

  return (
    <div className={`witem ${open ? "is-open" : ""}`}>
      <div className="witem__main">
        <div className="witem__text">
          <h4 className="witem__title">{item.title}</h4>
          <p className="witem__desc">{item.description}</p>
          <div className="witem__meta">
            {item.timing ? (
              <span className="witem__timing">{timingLabel(item.timing)}</span>
            ) : null}
            {!s.needsClient ? (
              <span className="witem__reassure">Nothing needed from you</span>
            ) : null}
          </div>
        </div>

        <div className="witem__side">
          <ProjectStatusBadge state={item.state} />
          {hasDetail ? (
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

      {hasDetail ? (
        <div className="witem__detail" id={panelId} hidden={!open}>
          {d.doing ? (
            <div className="mini-block">
              <h4>What we're doing</h4>
              <p>{d.doing}</p>
            </div>
          ) : null}
          {d.stands ? (
            <div className="mini-block">
              <h4>Where things stand</h4>
              <p>{d.stands}</p>
            </div>
          ) : null}
          {d.next ? (
            <div className="mini-block">
              <h4>What's next</h4>
              <p>{d.next}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
