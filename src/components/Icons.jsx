import React from "react";

/* ============================================================
   Line icons — the ActivatUs working style:
   single-weight geometric strokes (~1.8 on a 24 grid),
   fill:none, round caps/joins, drawn in ink. No two-tone,
   no gradient fills. (See brandkit icons.md.)

   Every icon is decorative-by-default (aria-hidden); the text
   label beside it carries the meaning.
   ============================================================ */

function Svg({ children, size = 24, strokeWidth = 1.8, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </Svg>
  );
}

export function WatchIcon(props) {
  // An eye — "we're watching this".
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function ActionIcon(props) {
  // A gentle alert — "we need something from you".
  return (
    <Svg {...props}>
      <path d="M12 3.5l9 16H3l9-16z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function ChevronIcon({ open, ...props }) {
  return (
    <Svg {...props}>
      <path d={open ? "M6 15l6-6 6 6" : "M9 6l6 6-6 6"} />
    </Svg>
  );
}

export function EyeBrowSpark(props) {
  // A tiny growth line, used sparingly as a section marker.
  return (
    <Svg {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </Svg>
  );
}

// Map a status key to its icon.
export function StatusIcon({ status, ...props }) {
  if (status === "good") return <CheckIcon {...props} />;
  if (status === "watch") return <WatchIcon {...props} />;
  return <ActionIcon {...props} />;
}
