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

/* ---- Projects icons ------------------------------------------ */

export function WorkingIcon(props) {
  // A pencil — "we're working on this".
  return (
    <Svg {...props}>
      <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </Svg>
  );
}

export function ReviewIcon(props) {
  // A speech/return arrow — "ready for your review / your feedback".
  return (
    <Svg {...props}>
      <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 3v-3.5A7.5 7.5 0 0 1 8 4.2" />
      <path d="M14 3.5l3 3-3 3" />
      <path d="M17 6.5h-4.5a3.5 3.5 0 0 0-3.5 3.5" />
    </Svg>
  );
}

export function UpcomingIcon(props) {
  // A calendar — "coming up".
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5v3M16 3.5v3" />
    </Svg>
  );
}

export function WaitingIcon(props) {
  return <ActionIcon {...props} />;
}

// Category icons
export function ContentIcon(props) {
  // Chat bubbles — content & social.
  return (
    <Svg {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5v4A2.5 2.5 0 0 1 14.5 13H9l-4 3.5V13a2.5 2.5 0 0 1-1-2v-4.5z" />
      <path d="M20 10.5v4a2.5 2.5 0 0 1-2.5 2.5H16" />
    </Svg>
  );
}

export function EmailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7.5l8 5.5 8-5.5" />
    </Svg>
  );
}

export function WebsiteIcon(props) {
  // A browser window — website & landing pages.
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.5 9h17" />
      <path d="M6.5 7h.01M9 7h.01" />
    </Svg>
  );
}

export function ProjectStatusIcon({ status, ...props }) {
  switch (status) {
    case "working":
      return <WorkingIcon {...props} />;
    case "review":
      return <ReviewIcon {...props} />;
    case "upcoming":
      return <UpcomingIcon {...props} />;
    case "complete":
      return <CheckIcon {...props} />;
    case "waiting":
      return <WaitingIcon {...props} />;
    default:
      return <WorkingIcon {...props} />;
  }
}

export function CategoryIcon({ name, ...props }) {
  if (name === "email") return <EmailIcon {...props} />;
  if (name === "website") return <WebsiteIcon {...props} />;
  return <ContentIcon {...props} />;
}
