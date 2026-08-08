import React from "react";
import { UpcomingIcon } from "./Icons.jsx";
import { upcomingItems } from "../lib/projectLang.js";

/* ============================================================
   ComingUpNext — "Coming up next".
   Gives clients confidence that work is planned. Simple item +
   date pairs, no schedules or Gantt charts.
   ============================================================ */

export default function ComingUpNext({ data }) {
  const items = upcomingItems(data);
  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="coming-heading">
      <div className="section__head">
        <h2 className="section__title" id="coming-heading">
          Coming up next
        </h2>
        <p className="section__intro">
          Work we've scheduled and will start soon.
        </p>
      </div>

      <ul className="upnext">
        {items.map((item) => (
          <li className="upnext__row" key={item.id}>
            <span className="upnext__icon" aria-hidden="true">
              <UpcomingIcon size={20} />
            </span>
            <div className="upnext__text">
              <span className="upnext__title">{item.title}</span>
              <span className="upnext__desc">{item.description}</span>
            </div>
            <span className="upnext__when">{item.timing.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
