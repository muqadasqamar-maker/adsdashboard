import React from "react";
import WorkItemRow from "./WorkItemRow.jsx";
import { CategoryIcon } from "./Icons.jsx";
import { workingItems, groupByCategory } from "../lib/projectLang.js";

/* ============================================================
   WorkInProgress — "What we're working on".
   The work currently moving forward, grouped into polished
   client-facing categories (never truncated internal labels).
   ============================================================ */

export default function WorkInProgress({ data }) {
  const items = workingItems(data);

  if (items.length === 0) {
    return (
      <section className="section" aria-labelledby="working-heading">
        <div className="section__head">
          <h2 className="section__title" id="working-heading">
            What we're working on
          </h2>
          <p className="section__intro">
            You're all caught up. We don't have any active project work to show
            right now.
          </p>
        </div>
      </section>
    );
  }

  const groups = groupByCategory(items);

  return (
    <section className="section" aria-labelledby="working-heading">
      <div className="section__head">
        <h2 className="section__title" id="working-heading">
          What we're working on
        </h2>
        <p className="section__intro">
          Here's what's currently moving forward with our team.
        </p>
      </div>

      <div className="work-groups">
        {groups.map((g) => (
          <div className="work-group" key={g.category.key}>
            <div className="work-group__head">
              <span className="work-group__icon" aria-hidden="true">
                <CategoryIcon name={g.category.icon} size={22} />
              </span>
              <h3 className="work-group__label">{g.category.label}</h3>
            </div>
            <div className="work-group__rows">
              {g.items.map((item) => (
                <WorkItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
