import React, { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import { ChevronIcon } from "./Icons.jsx";
import { checksByGroup } from "../lib/translate.js";

/* ============================================================
   AttentionSection — "What we're keeping an eye on".
   Warnings live apart from the healthy checks so they're easy to
   understand. Warm amber treatment (never a red emergency banner
   for a routine limitation). Technical wording stays folded away.
   ============================================================ */

function AttentionItem({ item }) {
  const [open, setOpen] = useState(false);
  const { content, state } = item;
  const tech = content.technical || [];
  const panelId = `att-${item.key}`;

  return (
    <div className="attention__item">
      <div className="attention__head">
        <div className="attention__text">
          <h3 className="attention__title">{content.title}</h3>
          <p className="attention__desc">{content.explanation}</p>
        </div>
        <StatusBadge status={state} />
      </div>

      {tech.length > 0 ? (
        <div className="attention__more">
          <button
            type="button"
            className="link-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide technical details" : "See technical details"}
            <ChevronIcon open={open} size={18} />
          </button>
          <div className="attention__tech" id={panelId} hidden={!open}>
            <dl className="detail-list detail-list--tech">
              {tech.map((t, i) => (
                <div className="detail-list__item" key={t.term + i}>
                  <dt>{t.term}</dt>
                  <dd>
                    <code>{t.value}</code>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="attention__footnote">
              This is the reason Google reports at the campaign level. Our latest
              check found no ads currently disapproved, so we're monitoring it
              rather than treating it as a problem with a specific ad.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AttentionSection({ data }) {
  const items = checksByGroup(data, "attention").filter(
    (c) => c.state !== "good"
  );

  return (
    <section className="section attention" aria-labelledby="attention-heading">
      <div className="section__head">
        <h2 className="section__title" id="attention-heading">
          What we're keeping an eye on
        </h2>
        <p className="section__intro">
          {items.length === 0
            ? "Nothing needs your attention right now. We'll tell you here the moment something does."
            : "These are the things we're watching for you. None of them need you to act today."}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="attention__list">
          {items.map((item) => (
            <AttentionItem key={item.key} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
