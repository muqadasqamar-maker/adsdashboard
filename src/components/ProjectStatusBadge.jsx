import React from "react";
import { workState } from "../lib/projectLang.js";
import { ProjectStatusIcon } from "./Icons.jsx";

/* ============================================================
   ProjectStatusBadge — the same pill grammar as the Ad Grant
   StatusBadge (icon + word, pastel tint, dark ink), extended to
   the five project states so both areas speak one visual language.
   ============================================================ */

export default function ProjectStatusBadge({ state = "working", size = "md" }) {
  const s = workState(state);
  return (
    <span className={`status-badge status-${s.tone} status-${size}`} role="status">
      <ProjectStatusIcon status={state} size={size === "lg" ? 22 : 18} />
      <span className="status-badge__label">{s.label}</span>
    </span>
  );
}
