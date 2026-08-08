import React from "react";
import { STATUS } from "../lib/status.js";
import { StatusIcon } from "./Icons.jsx";

/* ============================================================
   StatusBadge — the one pill that communicates state.
   Icon + word, never colour alone. Pastel-tint fill, dark ink
   (brand rule 11).  size="lg" for the hero, default for rows.
   ============================================================ */

export default function StatusBadge({ status = "good", size = "md" }) {
  const s = STATUS[status] || STATUS.good;
  return (
    <span
      className={`status-badge status-${s.tone} status-${size}`}
      role="status"
    >
      <StatusIcon status={status} size={size === "lg" ? 22 : 18} />
      <span className="status-badge__label">{s.label}</span>
    </span>
  );
}
