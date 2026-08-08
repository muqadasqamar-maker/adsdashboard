import React from "react";

/* ============================================================
   PrimaryNav — two client experiences, one product.
     Ad Grant  -> how things are performing
     Projects  -> what we're doing for you
   Simple, obvious selected state. Descriptions show on wider
   screens; the two destinations stay reachable everywhere.
   ============================================================ */

const TABS = [
  {
    id: "adgrant",
    label: "Ad Grant",
    description: "See how your Google Ad Grant is performing.",
  },
  {
    id: "projects",
    label: "Projects",
    description: "See what we're working on together.",
  },
];

export default function PrimaryNav({ view, onChange }) {
  return (
    <nav className="primary-nav" aria-label="Primary">
      <div className="primary-nav__inner">
        {TABS.map((t) => {
          const active = t.id === view;
          return (
            <button
              key={t.id}
              type="button"
              className={`nav-tab ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onChange(t.id)}
            >
              <span className="nav-tab__label">{t.label}</span>
              <span className="nav-tab__desc">{t.description}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
