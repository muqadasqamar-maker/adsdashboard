import React from "react";

/* ============================================================
   MetricItem — one proud number + a plain caption.
   The number is the hero of the block (brand rule 6).
   ============================================================ */

export default function MetricItem({ value, title, caption, note }) {
  return (
    <div className="metric">
      <div className="metric__value">{value}</div>
      <h3 className="metric__title">{title}</h3>
      <p className="metric__caption">{caption}</p>
      {note ? <p className="metric__note">{note}</p> : null}
    </div>
  );
}
