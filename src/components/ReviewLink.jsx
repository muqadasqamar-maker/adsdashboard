import React from "react";

/* ============================================================
   ReviewLink — a "Review this" link shown on any item that has a
   Review Link set in ClickUp. variant="primary" for the prominent
   review card; compact pill everywhere else.
   ============================================================ */

export default function ReviewLink({ href, variant = "compact" }) {
  if (!href) return null;

  if (variant === "primary") {
    return (
      <a
        className="as-btn as-btn-primary"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Review this
      </a>
    );
  }

  return (
    <a
      className="review-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      Review this
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </a>
  );
}
