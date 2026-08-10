import React from "react";
import { CheckIcon } from "./Icons.jsx";
import ReviewLink from "./ReviewLink.jsx";
import { completedItems } from "../lib/projectLang.js";

/* ============================================================
   RecentlyCompleted — "Recently completed".
   Communicates progress, not only unfinished work. Omitted
   entirely when there's nothing meaningful to show.
   ============================================================ */

export default function RecentlyCompleted({ data }) {
  const items = completedItems(data);
  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="done-heading">
      <div className="section__head">
        <h2 className="section__title" id="done-heading">
          Recently completed
        </h2>
        <p className="section__intro">Work we've finished for you lately.</p>
      </div>

      <ul className="done-list">
        {items.map((item) => (
          <li className="done-row" key={item.id}>
            <span className="done-row__icon" aria-hidden="true">
              <CheckIcon size={20} />
            </span>
            <div className="done-row__text">
              <span className="done-row__title">{item.title}</span>
              <span className="done-row__desc">{item.description}</span>
              {item.reviewLink ? <ReviewLink href={item.reviewLink} /> : null}
            </div>
            <span className="done-row__when">Completed {item.timing.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
